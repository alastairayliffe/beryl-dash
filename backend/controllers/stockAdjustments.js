const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')
const { 
    mappingHash,
    mappingDatesFunc 
} = require('./utils')
const {
    fetchGetUnleashed,
    itemsToGs
} = require('./api')



const unleashedFetchPrepAdj = (auth, mappingArray, mappingDates) => {
    let additionalMapping = mappingArray
    return unleashedData(auth, '1000')
        .then(allData => {
            let adjParent = allData.Items
            const mappingRow = mappingHash(mappingArray)
            const dateRow = mappingDatesFunc(mappingDates)

            let adjChild = []
            adjParent.forEach(row => {
                const adjDate = row.AdjustmentDate
                const adjNum = row.AdjustmentNumber
                const adjReason = row.AdjustmentReason
                const adjWarehouseCode = row.Warehouse.WarehouseCode
                row.StockAdjustmentLines.forEach(item => {
                    item.adjDate = adjDate
                    item.adjNum = adjNum
                    item.adjReason = adjReason
                    item.adjWarehouseCode = adjWarehouseCode
                    adjChild.push(item);
                })
            })
            const adjFinal = adjPrep(adjChild)
            const adjFinalWithMapping = adjFinal.map(adjLine => {

                const prodMapping = mappingRow[adjLine[5]] != undefined ? [mappingRow[adjLine[5]].productMapping] : adjLine[5]
                const dateData = (dateRow[adjLine[12]] != undefined ? dateRow[adjLine[12]] : [
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
             

                return adjLine.concat(dateData, prodMapping)
            })
            return itemsToGs(auth, adjFinalWithMapping, 'adjustments!A2:Z')
        })
      
}

const unleashedData = (auth, pageSize, pageNum) => {
    return fetchGetUnleashed(auth, 'StockAdjustments', pageSize, pageNum)
        .then(data => {
            if (pageNum === undefined) {
                return data
            } else {
                return inventoryStockPrep(data)
            }
        })
        .catch(err => console.log('err', err))

}

const adjPrep = (adjustments) => {
    return adjustments.map(adj => {
        const orderDateNew = parseInt(adj.adjDate.replace('/Date(', '').replace(')/', ''))
        const orderDateNewFormatted = moment(orderDateNew).format("MM/DD/YYYY")
        const orderDateGSFormat = parseInt(25569 + ((orderDateNew / 1000 / 60 / 60 / 24)))
        return  [       
            adj.Guid,
            adj.adjReason,
            adj.adjNum,
            adj.adjWarehouseCode,
            adj.adjDate,
            adj.Product.Guid,
            adj.Product.ProductCode,
            adj.Product.ProductDescription,
            adj.Comments,
            adj.NewActualValue,
            adj.NewQuantity,
            orderDateNewFormatted,
            orderDateGSFormat,
        ]
    })
}


module.exports = {
    unleashedFetchPrepAdj
}