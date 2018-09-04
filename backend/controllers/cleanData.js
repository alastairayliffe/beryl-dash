const { stockAdjHashed } = require('./cleanData/stockAdj')
const { customerHashed } = require('./cleanData/customer')
const { salesOrderHashed } = require('./cleanData/salesOrder')
const { stockOnHandHashed } = require('./cleanData/stockOnHand')
const { projectionsHashed } = require('./cleanData/projections')
const { prodMapHashed } = require('./cleanData/prodMap')
const { dateMapHashed } = require('./cleanData/dateMap')
const { projectionsAdjHashed } = require('./cleanData/projectionsAdj')


const cleanData = allFetchedData => {

    const stockAdj = stockAdjHashed(allFetchedData.stockAdjustments.Items)
    const customers = customerHashed(allFetchedData.customers)
    const salesOrder = salesOrderHashed(allFetchedData.salesOrders[0])
    const stockOnHand = stockOnHandHashed(allFetchedData.stockOnHand)
    const projections = projectionsHashed(allFetchedData.projections)
    const prodMap = prodMapHashed(allFetchedData.productMapping)
    const dateMap = dateMapHashed(allFetchedData.dateMapping)
    const projectionsAdj = projectionsAdjHashed(allFetchedData.projectionsAdj)

    console.log(prodMap)

    return {
        stockAdjustments: stockAdj,
        customers: customers,
        salesOrder: salesOrder,
        stockOnHand: stockOnHand,
        projections: projections,
        prodMap: prodMap,
        dateMap: dateMap,
        projAdj: projectionsAdj,
    }
}











module.exports = {
    cleanData
}