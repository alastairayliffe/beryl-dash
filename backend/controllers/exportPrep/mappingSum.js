const mappingSum = (cleanedData, prodMap) => {

    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    const prevMondayNum = parseInt(25569 + ((prevMonday.getTime() / 1000 / 60 / 60 / 24)))

    const sumMappingHash = {}
    const sumMappingId = []

    cleanedData.stockOnHand.byId.forEach(soh => {
        let sohHash = cleanedData.stockOnHand.byHash[soh];
        const correctProdMap = encodeURIComponent(sohHash.prodMap);
        const allocatedQtyVar = correctProdMap + '-allocatedQty'
        if (sumMappingHash[allocatedQtyVar] != undefined) {
            sumMappingHash[allocatedQtyVar].stock += -parseInt(sohHash.allocatedQty)
        } else {
            sumMappingHash[allocatedQtyVar] = {
                prodMap: sohHash.prodMap,
                type: '2 Allocated',
                stock: -parseInt(sohHash.allocatedQty),
            }
            sumMappingId.push(allocatedQtyVar)
        }
        const availableQtyVar = correctProdMap + '-availableQty'

        const qtyOnHandVar = correctProdMap + '-qtyOnHand'
        if (sumMappingHash[qtyOnHandVar] != undefined) {
            sumMappingHash[qtyOnHandVar].stock += parseInt(sohHash.qtyOnHand)
        } else {
            sumMappingHash[qtyOnHandVar] = {
                prodMap: sohHash.prodMap,
                type: '1 Inventory',
                stock: parseInt(sohHash.qtyOnHand),
            }
            sumMappingId.push(qtyOnHandVar)
        }
    })


    if (cleanedData.projAdj.byId.length > 0) {
        cleanedData.projAdj.byId.forEach(prodAdj => {
            let prodAdjHash = cleanedData.projAdj.byHash[prodAdj];
            const correctProdMap = prodMap.ref[encodeURIComponent(prodAdjHash.prodMap)];
            const prodAdjVar = correctProdMap.Mapping + '-' + prodAdjHash.adjType
            let stockAdjDateNum = (parseInt((parseInt(prodAdjHash.dateNum) - prevMondayNum) / 7) * 7) + prevMondayNum
            if (stockAdjDateNum >= prevMondayNum) {
                if (sumMappingHash[prodAdjVar] != undefined) {
                    sumMappingHash[prodAdjVar].stock += parseInt(prodAdjHash.quantity)
                } else {
                    sumMappingHash[prodAdjVar] = {
                        prodMap: correctProdMap.Mapping,
                        type: '3 Adj - ' + prodAdjHash.adjType,
                        stock: parseInt(prodAdjHash.quantity),
                    }

                    sumMappingId.push(prodAdjVar)

                }
            }
        })
    }

    cleanedData.projections.byId.forEach(prod => {
        let prodHash = cleanedData.projections.byHash[prod];
        const correctProdMap = prodMap.ref[encodeURIComponent(prodHash.product)];
        const projVar = correctProdMap.Mapping + '-projections'

        if (prodHash.dateNum >= prevMondayNum) {
            if (sumMappingHash[projVar] != undefined) {
                sumMappingHash[projVar].stock += -parseInt(prodHash.quantity)
            } else {
                sumMappingHash[projVar] = {
                    prodMap: correctProdMap.Mapping,
                    type: '4 Projected Sales',
                    stock: -parseInt(prodHash.quantity),
                }

                sumMappingId.push(projVar)
            }

        }
    })


    const test = sumMappingId.map(prodMapType => {
        return Object.values(sumMappingHash[prodMapType])
    })

    console.log(test)

    return sumMappingId.map(prodMapType => {
        return Object.values(sumMappingHash[prodMapType])
    })

}

module.exports = {
    mappingSum
}

