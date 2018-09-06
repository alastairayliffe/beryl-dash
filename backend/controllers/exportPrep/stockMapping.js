const { dateMapConst } = require('../const')

const stockMapping = (cleanedData) => {
    const mappedStock = cleanedData.stockOnHand.byId.map(product => {
        let stockHashed = cleanedData.stockOnHand.byHash[product]
        if (cleanedData.prodMap.byHash[encodeURIComponent(stockHashed.guid)] != undefined) {
            prodMap = { prodMap: cleanedData.prodMap.byHash[encodeURIComponent(stockHashed.guid)].Mapping }
        } else {
            prodMap = { prodMap: 'please_update' }
        }
        const stockOnHandFinal = Object.assign(stockHashed, prodMap)
        return Object.values(stockOnHandFinal)


    })
    return mappedStock;
}


module.exports = {
    stockMapping
}