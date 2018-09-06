const { dateMapConst } = require('../const')


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

module.exports = {
    salesOrderMapping
}