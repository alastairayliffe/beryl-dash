const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')
const { mappingHash, customerHash } = require('./utils')
const {
    fetchGetUnleashed,
    itemsToGs
} = require('./api')



const unleashedFetchPrepSo = (auth, mappingArray, customerData) => {
    let additionalMapping = mappingArray
    return unleashedData(auth, '1')
        .then(data => {
            const testing = testingFunc()
            const numberOfPages = Math.ceil(data.Pagination.NumberOfItems / 1000)
            let promises = [];
            let pageNum = (testing === true) ? 2 : numberOfPages;
            let pageSize = (testing === true) ? 2 : 1000;
            for (i = 1; i < pageNum + 1; i++) {
                promises.push(unleashedData(auth, pageSize, (i)))
            }
            return Promise.all(promises)
        })
        .then(allData => {
            let finalSoArray = []
            allData.forEach(groupSo => {
                finalSoArray.push(...groupSo)
            })


            const mappingRow = mappingHash(mappingArray)
            const customerRow = customerHash(customerData)
    

            const soArrayWithMapping = finalSoArray.map(soLine => {
                const customerType = customerRow[soLine[4]]
                soLine.push(customerType)

                if( mappingRow[soLine[7]] != undefined){
                 const mappingProduct = mappingRow[soLine[7]].productMapping
        
                 soLine.push(mappingProduct)
                } else {
                    if(soLine[7] === '00000000-0000-0000-0000-000000000000') {
                        soLine.push('shipping')
                    } else {
                        soLine.push('add_to_inventory')

              
                    }
                }
                
          
                return soLine
            })

            return itemsToGs(auth, soArrayWithMapping,'sales-orders!A2:r' )
        })
}

const unleashedData = (auth, pageSize, pageNum) => {
    return fetchGetUnleashed(auth, 'SalesOrders', pageSize, pageNum)
        .then(data => {
            if (pageNum === undefined) {
                return data
            } else {
                return inventorySalesOrderPrep(data)
            }
        })
        .catch(err => console.log('err', err))

}


const inventorySalesOrderPrep = (salesOrders) => {
    let finalItem = [];

    salesOrders.Items.forEach(salesOrder => {
        const orderDateNew = parseInt(salesOrder.OrderDate.replace('/Date(', '').replace(')/', ''))
        const orderDateNewFormatted = moment(orderDateNew).format("MM/DD/YYYY")

        let salesItems = salesOrder.SalesOrderLines.map(salesOrderLine => {
            return [
                orderDateNewFormatted,
                salesOrder.OrderNumber,
                salesOrder.Customer.CustomerCode,
                salesOrder.Customer.CustomerName,
                salesOrder.Customer.Guid,
                salesOrderLine.LineNumber,
                salesOrderLine.LineType,
                salesOrderLine.Product.Guid,
                salesOrderLine.Product.ProductCode,
                salesOrderLine.Product.ProductDescription,
                salesOrderLine.OrderQuantity,
                salesOrderLine.UnitPrice,
                salesOrderLine.DiscountRate,
                salesOrderLine.LineTotal,
                salesOrderLine.Guid,
                salesOrderLine.UnitPrice
            ]
        })
        finalItem.push(...salesItems)
    })
    return finalItem
}


module.exports = {
    unleashedFetchPrepSo
}