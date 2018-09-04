
const moment = require('moment');


const stockAdjHashed = stockAdjArray => {
    let stockAdjNew = {
        byHash: {},
        byId: []
    };

    if (stockAdjArray!= undefined &&  stockAdjArray.length > 0) {
        stockAdjArray.forEach(rowStockAdj => {
            const adjDate = rowStockAdj.AdjustmentDate
            const orderDateNew = parseInt(adjDate.replace('/Date(', '').replace(')/', ''))
            const orderDateNewFormatted = moment(orderDateNew).format("MM/DD/YYYY")
            const orderDateGSFormat = parseInt(25569 + ((orderDateNew / 1000 / 60 / 60 / 24)))
            const adjNum = rowStockAdj.AdjustmentNumber
            const adjReason = rowStockAdj.AdjustmentReason
            const adjWarehouseCode = rowStockAdj.Warehouse.WarehouseCode
            rowStockAdj.StockAdjustmentLines.forEach(rowStockAdjLine => {
                let rowStockAdjLineNew = {
                    guid: rowStockAdjLine.Guid,
                    adjReason: adjReason,
                    adjNum: adjNum,
                    adjWarehouseCode: adjWarehouseCode,
                    adjDate: adjDate,
                    productGuid: rowStockAdjLine.Product.Guid,
                    productProductCode: rowStockAdjLine.Product.ProductCode,
                    productProductDescription: rowStockAdjLine.Product.ProductDescription,
                    comments: rowStockAdjLine.Comments,
                    newActualValue: rowStockAdjLine.NewActualValue,
                    newQuantity: rowStockAdjLine.NewQuantity,
                    orderDateNewFormatted: orderDateNewFormatted,
                    orderDateGSFormat: orderDateGSFormat,

                }
                let hashedStockAdjValue = rowStockAdjLine.Guid
                stockAdjNew.byHash[hashedStockAdjValue] = rowStockAdjLineNew
                stockAdjNew.byId.push(hashedStockAdjValue);
            })
        })

    }
    return stockAdjNew;
}

module.exports = {
    stockAdjHashed
}