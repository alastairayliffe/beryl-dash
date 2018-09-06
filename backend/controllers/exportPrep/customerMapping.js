const { dateMapConst } = require('../const')

const customerMapping = (cleanedData) => {
    return cleanedData.customers.byId.map(customer => {
        return Object.values(cleanedData.customers.byHash[customer])
    })
}


module.exports = {
    customerMapping
}