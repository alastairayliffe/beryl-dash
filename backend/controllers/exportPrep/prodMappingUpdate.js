const { dateMapConst } = require('../const')

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
    prodMappingUpdate
}