const { dateMapConst } = require('../const')

const pivotTablePrep = (cleanedData, prodMap) => {
    console.log(cleanedData, prodMap)
    let pivotTableData = {
        byHash: {},
        byId: []
    }

    const currentDate = new Date();
    const currentDateNum = parseInt(25569 + ((currentDate.getTime() / 1000 / 60 / 60 / 24)) - 6)

    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    const prevMondayNum = parseInt(25569 + ((prevMonday.getTime() / 1000 / 60 / 60 / 24)))


    // number of future weeks.
    let stockFcstDate = prevMondayNum;
    for (i = 0; i < 52; i++) {

        prodMap.unique.forEach(prod => {
            const stockFcstId = stockFcstDate + '-' + encodeURIComponent(prod) + '-' + false + '-' + false + '-stockFcst'
            pivotTableData.byId.push(stockFcstId)
            pivotTableData.byHash[stockFcstId] = {
                id: stockFcstId,
                dateNum: parseInt(stockFcstDate),
                prodMap: prod,
                mapExclDate: encodeURIComponent(prod) + '-' + false + '-' + false + '-stockFcst',
                customerType: false,
                salesOrderType: false,
                quantity: 0,
                quantityAct: 0,
                quantityVar: 0,
                revenue: 0,
                revenueAct: 0,
                revenueVar: 0,
                currentStock: 0,
                stockMovement: 0,
                remainingStock: 0,
                stockTrack: true,
                type: 'fcst'
            }
        })
        stockFcstDate += 7;
    }



    //projection adjustments
    if (cleanedData.projAdj.byId.length > 0) {
        cleanedData.projAdj.byId.forEach(prodAdj => {
            let prodAdjHash = cleanedData.projAdj.byHash[prodAdj];
            const correctProdMap = prodMap.ref[encodeURIComponent(prodAdjHash.prodMap)];
            let stockAdjDateNum = (parseInt((parseInt(prodAdjHash.dateNum) - prevMondayNum) / 7) * 7) + prevMondayNum
            let stockAdjId = stockAdjDateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + false + '-' + false + '-stockFcst'
            if (pivotTableData.byHash[stockAdjId] != undefined) {
                pivotTableData.byHash[stockAdjId].stockMovement = +parseInt(prodAdjHash.quantity)
            }
        })
    }

    //projections
    cleanedData.projections.byId.forEach(prod => {
        let prodHash = cleanedData.projections.byHash[prod];
        const correctProdMap = prodMap.ref[encodeURIComponent(prodHash.product)];

        let stockFcstDateNum = (parseInt((parseInt(prodHash.dateNum) - prevMondayNum) / 7) * 7) + prevMondayNum
        let stockFcstId = stockFcstDateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + false + '-' + false + '-stockFcst'
        if (pivotTableData.byHash[stockFcstId] != undefined) {
            pivotTableData.byHash[stockFcstId].stockMovement += -parseFloat(prodHash.quantity)
        }

        const prodId = prodHash.dateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + false + '-' + false + '-fcst'
        const remainingStockAdj = (parseInt(prodHash.dateNum) > currentDateNum ? - (parseFloat(prodHash.quantity)) : 0)

        if (parseFloat(prodHash.quantity) != 0 || parseFloat(prodHash.revenue) != 0 || remainingStockAdj != 0) {
            if (pivotTableData.byHash[prodId] === undefined) {
                pivotTableData.byId.push(prodId)
                pivotTableData.byHash[prodId] = {
                    id: prodId,
                    dateNum: parseInt(prodHash.dateNum),
                    prodMap: correctProdMap.Mapping,
                    mapExclDate: encodeURIComponent(prodHash.product) + '-' + false + '-' + false,
                    customerType: prodHash.customerType,
                    salesOrderType: prodHash.salesOrderType,
                    quantity: parseFloat(prodHash.quantity),
                    quantityAct: 0,
                    quantityVar: -parseFloat(prodHash.quantity),
                    revenue: parseFloat(prodHash.revenue),
                    revenueAct: 0,
                    revenueVar: -parseFloat(prodHash.revenue),
                    currentStock: 0,
                    stockMovement: 0,
                    remainingStock: 0,
                    stockTrack: false,
                    type: 'fcst'

                }
            } else {
                pivotTableData.byHash[prodId].quantity = pivotTableData.byHash[prodId].quantity + parseFloat(prodHash.quantity)
                pivotTableData.byHash[prodId].revenue = pivotTableData.byHash[prodId].revenue + parseFloat(prodHash.revenue)
            }
        }

    })

    //salesOrder
    cleanedData.salesOrder.byId.forEach(so => {
        let soHash = cleanedData.salesOrder.byHash[so];
        const salesOrderType = typeState(soHash.salesOrderType)
        const customerType = typeState(soHash.customerType)
        const soId = soHash.dateNum + '-' + encodeURIComponent(soHash.prodMap) + '-' + salesOrderType + '-' + customerType + '-actual'

        if (pivotTableData.byHash[soId] === undefined) {
            pivotTableData.byId.push(soId)
            pivotTableData.byHash[soId] = {
                id: soId,
                dateNum: parseInt(soHash.dateNum),
                prodMap: soHash.prodMap,
                mapExclDate: encodeURIComponent(soHash.prodMap) + '-' + salesOrderType + '-' + customerType,
                customerType: soHash.customerType,
                salesOrderType: soHash.salesOrderType,
                quantity: parseFloat(soHash.orderQuantity),
                quantityAct: parseFloat(soHash.orderQuantity),
                quantityVar: parseFloat(soHash.orderQuantity),
                revenue: parseFloat(soHash.lineTotal),
                revenueAct: parseFloat(soHash.lineTotal),
                revenueVar: parseFloat(soHash.lineTotal),
                currentStock: 0,
                stockMovement: 0,
                remainingStock: 0,
                stockTrack: false,
                type: 'actual'
            }
        } else {
            pivotTableData.byHash[soId].quantity = pivotTableData.byHash[soId].quantity + parseFloat(soHash.orderQuantity)
            pivotTableData.byHash[soId].revenue = pivotTableData.byHash[soId].revenue + parseFloat(soHash.lineTotal)
        }

    })

    //stockOnHand

    cleanedData.stockOnHand.byId.forEach(soh => {
        let sohHash = cleanedData.stockOnHand.byHash[soh];
        const correctProdMap = encodeURIComponent(sohHash.prodMap);
        let sohFcstId = prevMondayNum + '-' + correctProdMap + '-' + false + '-' + false + '-stockFcst'
        if (pivotTableData.byHash[sohFcstId] != undefined) {
            pivotTableData.byHash[sohFcstId].stockMovement += parseFloat(sohHash.availableQty)
        }
    })

    let sortFinalPivot = (a, b) => {
        if (a.stockTrack < b.stockTrack) {
            return -1;
        }
        if (a.stockTrack > b.stockTrack) {
            return 1;
        }
        if (a.prodMap < b.prodMap) {
            return -1;
        }
        if (a.prodMap > b.prodMap) {
            return 1;
        }
        return a.dateNum - b.dateNum;
    }

    const pivotTableArray = Object.values(pivotTableData.byHash)
    const pivotStockCount = pivotTableArray.sort(sortFinalPivot)

    let recordNum = 0;

    const pivotDataPreDates = pivotStockCount.map(currentItem => {
        let prevItem = {}

        if (recordNum > 0) {
            prevItem = pivotStockCount[recordNum - 1]
        }

        if (currentItem.prodMap === prevItem.prodMap && currentItem.stockTrack === true && prevItem.stockTrack === true) {
            currentItem.remainingStock = currentItem.stockMovement + prevItem.remainingStock
        } else if (currentItem.stockTrack === true) {
            currentItem.remainingStock = currentItem.stockMovement;
        }

        recordNum += 1
        return currentItem

    })

    const pivotFinal = pivotDataPreDates.map(stockLines => {
        const dateRecord = cleanedData.dateMap.byHash[stockLines.dateNum] != undefined ? cleanedData.dateMap.byHash[stockLines.dateNum] : dateMapConst();
        const dateRecordArray = Object.values(dateRecord)
        let finalArray = Object.values(stockLines).concat(dateRecordArray)
        return finalArray;
    })

    console.log(pivotFinal)

    return { ...pivotTableData, export: pivotFinal }

}



const typeState = content => {
    return (content === '' ? false : encodeURIComponent(content))
}



module.exports = {
    pivotTablePrep
}