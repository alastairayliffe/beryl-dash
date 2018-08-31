const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')
const {
    mappingHash,
    customerHash,
    mappingDatesFunc
} = require('./utils')
const {
    fetchGetUnleashed,
    itemsToGs
} = require('./api')



const unleashedFetchPrepSo = (auth, mappingArray, customerData, mappingDates) => {
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
            const dateRow = mappingDatesFunc(mappingDates)


            const soArrayWithMapping = finalSoArray.map(soLine => {
                const customerType = (customerRow[soLine[5]] != undefined ? customerRow[soLine[5]].channel : '')
                const country = [(customerRow[soLine[5]] != undefined ? customerRow[soLine[5]].country : '')]
                const dateData = (dateRow[soLine[17]] != undefined ? dateRow[soLine[17]] : [
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                    'old',
                ] )
                soLine.push(customerType)
                soLineAdj = soLine.concat(dateData, country );

                if (mappingRow[soLineAdj[8]] != undefined) {
                    const mappingProduct = mappingRow[soLineAdj[8]].productMapping

                    soLineAdj.push(mappingProduct)
                } else {
                    if (soLineAdj[7] === '00000000-0000-0000-0000-000000000000') {
                        soLineAdj.push('shipping')
                    } else {
                        soLineAdj.push('add_to_inventory')


                    }
                }


                return soLineAdj
            })

            return itemsToGs(auth, soArrayWithMapping, 'sales-orders!A2:AE')
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
        const orderDateGSFormat = parseInt(25569 + ((orderDateNew / 1000 / 60 / 60 / 24)))
        const salesPersonAdj = salesOrder.SalesPerson === null ? '' : salesOrder.SalesPerson.FullName
        let salesItems = salesOrder.SalesOrderLines.map(salesOrderLine => {
            return [
                orderDateNewFormatted,
                salesOrder.OrderNumber,
                salesPersonAdj,
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
                salesOrderLine.UnitPrice,
                orderDateGSFormat
            ]
        })
        finalItem.push(...salesItems)
    })
    return finalItem
}


module.exports = {
    unleashedFetchPrepSo
}