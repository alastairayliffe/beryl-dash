const { dateMapConst } = require('../const')

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

module.exports = {
    stockAdjMapping
}