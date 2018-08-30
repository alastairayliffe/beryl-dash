const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')
const { mappingHash } = require('./utils')
const {
    fetchGetUnleashed,
    itemsToGs
} = require('./api')



const unleashedFetchPrepInv = (auth, mappingArray) => {
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
            let finalInvArray = []
            allData.forEach(groupInvent => {
                finalInvArray.push(...groupInvent)
            })


            const mappingRow = mappingHash(mappingArray)
            const withMapping = finalInvArray.map(row => {

                if (mappingRow[row[2]] === undefined) {
                    let mappingProduct = [
                        row[0],
                        row[1],
                        row[2],
                        row[3],
                        'please_update'
                    ]
                    additionalMapping.push(mappingProduct)
                    row.push('please_update')
                    mappingRow[row[2]] = {
                        productMapping: 'please_update'
                    }

                } else {
                    row.push(mappingRow[row[2]].productMapping)
                }
                return row;
            })

            return itemsToGs(auth, withMapping, 'inventory!A2:n')
        })
        .then(inventory => {
            return itemsToGs(auth, additionalMapping, 'product-mapping!A2:e')
        })
}

const unleashedData = (auth, pageSize, pageNum) => {
    return fetchGetUnleashed(auth, 'StockOnHand', pageSize, pageNum)
        .then(data => {
            if (pageNum === undefined) {
                return data
            } else {
                return inventoryStockPrep(data)
            }
        })
        .catch(err => console.log('err', err))

}

const inventoryStockPrep = (products) => {
    return products.Items.map(product => {
        return [
            product.ProductCode,
            product.ProductDescription,
            product.ProductGuid,
            product.ProductGroupName,
            product.WarehouseId,
            product.Warehouse,
            product.WarehouseCode,
            product.OnPurchase,
            product.AllocatedQty,
            product.AvailableQty,
            product.QtyOnHand,
            product.AvgCost,
            product.Guid
        ]
    })
}


module.exports = {
    unleashedFetchPrepInv
}