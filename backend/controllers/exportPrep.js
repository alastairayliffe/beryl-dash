const { dateMapConst } = require('./const')

const exportPrep = cleanedData => {
    console.log(cleanedData)
    const salesOrderMapped = salesOrderMapping(cleanedData)
    const stockMapped = stockMapping(cleanedData)
    const stockAdjMapped = stockAdjMapping(cleanedData)
    const customersMapped = customerMapping(cleanedData)
    const prodMapped = prodMappingUpdate(cleanedData);
    const pivot = pivotTablePrep(cleanedData, prodMapped)
    console.log(pivot)

    return {
        salesOrder: salesOrderMapped,
        stockOnHand: stockMapped,
        stockAdjustments: stockAdjMapped,
        customers: customersMapped,
        prodMap: prodMapped,
        pivot: pivot
    }
}

const pivotTablePrep = (cleanedData, prodMap) => {
    console.log(cleanedData, prodMap)
    // create default list (with projections and data mapping)
    //prepare all data sources for consolidation
    // then consolidate

    let pivotTableData = {
        byHash: {},
        byId: []
    }

    const currentDate = new Date();
    const currentDateNum = parseInt(25569 + ((currentDate.getTime() / 1000 / 60 / 60 / 24)) - 6)

    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    const prevMondayNum = parseInt(25569 + ((prevMonday.getTime() / 1000 / 60 / 60 / 24)))

    //create initail pivot
    cleanedData.dateMap.byId.forEach(date => {
        let dateHash = cleanedData.dateMap.byHash[date];
        prodMap.unique.forEach(prodMapLine => {
            //DATE + prodMap + salesOrderType + customerType
            const mapId = dateHash.dateNum + '-' + encodeURIComponent(prodMapLine) + '-' + false + '-' + false + '-fcst';
            pivotTableData.byId.push(mapId)
            pivotTableData.byHash[mapId] = {
                id: mapId,
                dateNum: parseInt(dateHash.dateNum),
                prodMap: prodMapLine,
                mapExclDate: encodeURIComponent(prodMapLine) + '-' + false + '-' + false,
                customerType: '',
                salesOrderType: '',
                quantity: 0,
                revenue: 0,
                currentStock: 0,
                remainingStock: 0,
                stockTrack: true,
                type: 'fcst'
            }
        })
    })

    //projection adjustments
    if (cleanedData.projAdj.byId > 0) {
        cleanedData.projAdj.byId.forEach(prodAdj => {
            let prodAdjHash = cleanedData.projAdj.byHash[prodAdj];
            const salesOrderType = typeState(prodAdjHash.salesOrderType)
            const customerType = typeState(prodAdjHash.customerType)
            const correctProdMap = prodMap.ref[encodeURIComponent(prodAdjHash.prodMap)];
            const prodAdjId = prodAdjHash.dateNum + '-' + encodeURIComponent(correctProdMap) + '-' + salesOrderType + '-' + customerType + '-fcst'
            const remainingStockAdj = (parseInt(prodAdjHash.dateNum) > currentDateNum ? (parseFloat(prodAdjHash.quantity)) : 0)

            if (pivotTableData.byHash[prodAdjId] === undefined) {
                pivotTableData.byId.push(prodAdjId)
                pivotTableData.byHash[prodAdjId] = {
                    id: prodAdjId,
                    dateNum: parseInt(prodAdjHash.dateNum),
                    prodMap: correctProdMap.Mapping,
                    mapExclDate: encodeURIComponent(prodAdjHash.prodMap) + '-' + salesOrderType + '-' + customerType  + '-fcst',
                    customerType: prodAdjHash.customerType,
                    salesOrderType: prodAdjHash.salesOrderType,
                    quantity: parseFloat(prodAdjHash.quantity),
                    revenue: 0,
                    currentStock: 0,
                    remainingStock: remainingStockAdj,
                    stockTrack: false,
                    type: 'fcst'
                }
            } else {
                pivotTableData.byHash[prodAdjId].quantity = pivotTableData.byHash[prodAdjId].quantity + parseFloat(prodAdjHash.quantity)

            }

            const stockUsagaIndex = prodAdjHash.dateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + false + '-' + false  + '-fcst';
            pivotTableData.byHash[stockUsagaIndex].remainingStock = pivotTableData.byHash[stockUsagaIndex].remainingStock + remainingStockAdj

        })
    }

    //projections
    cleanedData.projections.byId.forEach(prod => {
        let prodHash = cleanedData.projections.byHash[prod];
        const salesOrderType = typeState(prodHash.salesOrderType)
        const customerType = typeState(prodHash.customerType)
        const correctProdMap = prodMap.ref[encodeURIComponent(prodHash.product)];
        const prodId = prodHash.dateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + salesOrderType + '-' + customerType + '-fcst'
        const remainingStockAdj = (parseInt(prodHash.dateNum) > currentDateNum ? - (parseFloat(prodHash.quantity)) : 0)

        if (pivotTableData.byHash[prodId] === undefined) {
            pivotTableData.byId.push(prodId)
            pivotTableData.byHash[prodId] = {
                id: prodId,
                dateNum: parseInt(prodHash.dateNum),
                prodMap: correctProdMap.Mapping,
                mapExclDate: encodeURIComponent(prodHash.product) + '-' + salesOrderType + '-' + customerType,
                customerType: prodHash.customerType,
                salesOrderType: prodHash.salesOrderType,
                quantity: parseFloat(prodHash.quantity),
                revenue: parseFloat(prodHash.revenue),
                currentStock: 0,
                remainingStock: remainingStockAdj,
                stockTrack: false,
                type: 'fcst'

            }
        } else {
            pivotTableData.byHash[prodId].quantity = pivotTableData.byHash[prodId].quantity + parseFloat(prodHash.quantity)
            pivotTableData.byHash[prodId].revenue = pivotTableData.byHash[prodId].revenue + parseFloat(prodHash.revenue)
        }

        const stockUsagaIndex = prodHash.dateNum + '-' + encodeURIComponent(correctProdMap.Mapping) + '-' + false + '-' + false  + '-fcst';
        pivotTableData.byHash[stockUsagaIndex].remainingStock = pivotTableData.byHash[stockUsagaIndex].remainingStock + remainingStockAdj

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
                revenue: parseFloat(soHash.lineTotal),
                currentStock: 0,
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
        const sohId = prevMondayNum + '-' + encodeURIComponent(sohHash.prodMap) + '-' + false + '-' + false + '-fcst'
        if (pivotTableData.byHash[sohId] === undefined) {
            pivotTableData.byId.push(sohId)
            pivotTableData.byHash[sohId] = {
                id: sohId,
                dateNum: parseInt(prevMondayNum),
                prodMap: sohHash.prodMap,
                mapExclDate: encodeURIComponent(sohHash.prodMap) + '-' + false + '-' + false,
                customerType: false,
                salesOrderType: false,
                quantity: 0,
                revenue: 0,
                currentStock: sohHash.availableQty,
                remainingStock: 0,
                stockTrack: false,
                type: 'fcst'
            }
        } else {
            pivotTableData.byHash[sohId].currentStock = pivotTableData.byHash[sohId].currentStock + parseFloat(sohHash.availableQty)
        }
    })


    let sortFinalPivot = (a, b) => {

        if (a.prodMap < b.prodMap) {
            return -1;
        }
        if (a.prodMap > b.prodMap) {
            return 1;
        }
        if (a.stockTrack < b.stockTrack) {
            return -1;
        }
        if (a.stockTrack > b.stockTrack) {
            return 1;
        }

        return a.dateNum - b.dateNum;
    }

    const pivotTableArray = Object.values(pivotTableData.byHash)


    console.log(pivotTableArray)





    const pivotStockCount = pivotTableArray
        .filter(all => {
            return all.stockTrack === true
        })
        .sort(sortFinalPivot)


    const pivotOther = pivotTableArray
        .filter(all => {
            return all.stockTrack === false
        })


    let lineIndex = 0;
    const pivotStockFinal = pivotStockCount.map(stockLines => {
        const prevRecordIndex = lineIndex - 1;
        const prevRecord = (prevRecordIndex > -1) ? pivotStockCount[prevRecordIndex] : {};
        if (prevRecord.prodMap === stockLines.prodMap) {
            stockLines.remainingStock = stockLines.remainingStock + stockLines.currentStock + prevRecord.remainingStock;
        } else {
            stockLines.remainingStock = stockLines.remainingStock + stockLines.currentStock;
        }
        const dateRecord = cleanedData.dateMap.byHash[stockLines.dateNum] != undefined ? cleanedData.dateMap.byHash[stockLines.dateNum] : dateMapConst();
        const dateRecordArray = Object.values(dateRecord)
        let finalArray = Object.values(stockLines).concat(dateRecordArray)
        lineIndex = lineIndex + 1;
        return finalArray;
    })

    const pivotOtherFinal = pivotOther.map(stockLines => {
        const dateRecord = cleanedData.dateMap.byHash[stockLines.dateNum] != undefined ? cleanedData.dateMap.byHash[stockLines.dateNum] : dateMapConst();
        const dateRecordArray = Object.values(dateRecord)
        let finalArray = Object.values(stockLines).concat(dateRecordArray)
        return finalArray;
    })


    return { ...pivotTableData, export: pivotStockFinal.concat(pivotOtherFinal) }

}

const typeState = content => {
    return (content === '' ? false : encodeURIComponent(content))
}


const customerMapping = (cleanedData) => {
    return cleanedData.customers.byId.map(customer => {
        return Object.values(cleanedData.customers.byHash[customer])
    })
}

const stockAdjMapping = (cleanedData) => {
    return cleanedData.stockAdjustments.byId.map(adj => {
        let adjHashed = cleanedData.stockAdjustments.byHash[adj]
        const dateMap = (cleanedData.dateMap.byHash[adjHashed.orderDateGSFormat] != undefined ? cleanedData.dateMap.byHash[adjHashed.orderDateGSFormat] : dateMapConst());
        let prodMap = {}
        if (cleanedData.prodMap.byHash[adjHashed.productGuid] != undefined) {
            prodMap = { prodMap: cleanedData.prodMap.byHash[adjHashed.productGuid].Mapping }
        } else {
            prodMap = { prodMap: 'please_update' }
        }
        const adjFinal = Object.assign(adjHashed, dateMap, prodMap)
        return Object.values(adjFinal)
    })
}




const stockMapping = (cleanedData) => {
    return cleanedData.stockOnHand.byId.map(product => {
        let stockHashed = cleanedData.stockOnHand.byHash[product]
        if (cleanedData.prodMap.byHash[encodeURIComponent(stockHashed.guid)] != undefined) {
            prodMap = { prodMap: cleanedData.prodMap.byHash[encodeURIComponent(stockHashed.guid)].Mapping }
        } else {
            prodMap = { prodMap: 'please_update' }
        }
        const stockOnHandFinal = Object.assign(stockHashed, prodMap)
        return Object.values(stockOnHandFinal)
    })
}

const salesOrderMapping = (cleanedData) => {
    return cleanedData.salesOrder.byId.map(so => {
        let soHashed = cleanedData.salesOrder.byHash[so]
        const customerType = (cleanedData.customers.byHash[soHashed.customerGuid] != undefined ? { customerType: cleanedData.customers.byHash[soHashed.customerGuid].customerType } : { customerType: '' });
        const dateMap = (cleanedData.dateMap.byHash[soHashed.orderDateGSFormat] != undefined ? cleanedData.dateMap.byHash[soHashed.orderDateGSFormat] : dateMapConst());
        let prodMap = {}
        if (cleanedData.prodMap.byHash[encodeURIComponent(soHashed.productGuid)] != undefined) {
            prodMap = { prodMap: cleanedData.prodMap.byHash[encodeURIComponent(soHashed.productGuid)].Mapping }
        } else {
            prodMap = { prodMap: 'please_update' }
        }
        const soFinal = Object.assign(soHashed, customerType, dateMap, prodMap)
        return Object.values(soFinal)
    })
}




const prodMappingUpdate = (cleanedData) => {
    let prodMappingTemp = { ...cleanedData.prodMap.byHash }

    cleanedData.projAdj.byId.forEach(projAdj => {
        let projAdjHashed = cleanedData.projAdj.byHash[projAdj]
        if (prodMappingTemp[encodeURIComponent(projAdjHashed.prodMap)] === undefined) {
            prodMappingTemp[encodeURIComponent(projAdjHashed.prodMap)] = {
                ProductCode: projAdjHashed.prodMap,
                ProductDescription: projAdjHashed.prodMap,
                ProductGuid: projAdjHashed.prodMap,
                ProductGroupName: projAdjHashed.prodMap,
                Mapping: 'please_update'
            }
        }
    })

    cleanedData.stockOnHand.byId.forEach(product => {
        let stockHashed = cleanedData.stockOnHand.byHash[product]
        if (prodMappingTemp[encodeURIComponent(product)] === undefined) {
            prodMappingTemp[encodeURIComponent(product)] = {
                ProductCode: stockHashed.productCode,
                ProductDescription: stockHashed.productDescription,
                ProductGuid: stockHashed.guid,
                ProductGroupName: stockHashed.productGroupName,
                Mapping: 'please_update'
            }
        }
    })

    cleanedData.projections.byId.forEach(projection => {
        let projectionHashed = cleanedData.projections.byHash[projection]
        if (prodMappingTemp[encodeURIComponent(projectionHashed.product)] === undefined) {
            prodMappingTemp[encodeURIComponent(projectionHashed.product)] = {
                ProductCode: projectionHashed.product,
                ProductDescription: projectionHashed.product,
                ProductGuid: projectionHashed.product,
                ProductGroupName: projectionHashed.product,
                Mapping: 'please_update'
            }
        }
    })

    cleanedData.salesOrder.byId.forEach(line => {
        let lineHashed = cleanedData.salesOrder.byHash[line]
        if (prodMappingTemp[encodeURIComponent(lineHashed.productGuid)] === undefined) {
            prodMappingTemp[encodeURIComponent(lineHashed.productGuid)] = {
                ProductCode: lineHashed.productCode,
                ProductDescription: lineHashed.productDescription,
                ProductGuid: lineHashed.productGuid,
                ProductGroupName: '',
                Mapping: 'please_update'
            }
        }
    })

    cleanedData.stockAdjustments.byId.forEach(adj => {
        let adjHashed = cleanedData.stockAdjustments.byHash[adj]
        if (prodMappingTemp[encodeURIComponent(adjHashed.productGuid)] === undefined) {
            prodMappingTemp[encodeURIComponent(adjHashed.productGuid)] = {
                ProductCode: adjHashed.productCode,
                ProductDescription: adjHashed.productDescription,
                ProductGuid: adjHashed.productGuid,
                ProductGroupName: '',
                Mapping: 'please_update'
            }
        }
    })
    console.log(prodMappingTemp)

    const productMapArray = Object.values(prodMappingTemp);

    let prodMapUnique = {}

    const exportProdMap = productMapArray.map(prodMap => {
        if (prodMapUnique[prodMap.Mapping] === undefined) {
            prodMapUnique[prodMap.Mapping] = prodMap.Mapping
        }
        return [
            prodMap.ProductCode,
            prodMap.ProductDescription,
            prodMap.ProductGuid,
            prodMap.ProductGroupName,
            prodMap.Mapping
        ]
    })

    const prodMapUniqueArray = Object.values(prodMapUnique)

    return {
        export: exportProdMap,
        unique: prodMapUniqueArray,
        ref: prodMappingTemp
    }


}






module.exports = {
    exportPrep
}