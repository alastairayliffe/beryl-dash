const { dateMapConst } = require('./const')

const { salesOrderMapping } = require('./exportPrep/salesOrderMapping')
const { stockMapping } = require('./exportPrep/stockMapping')
const { stockAdjMapping } = require('./exportPrep/stockAdjMapping')
const { customerMapping } = require('./exportPrep/customerMapping')
const { prodMappingUpdate } = require('./exportPrep/prodMappingUpdate')
const { pivotTablePrep } = require('./exportPrep/pivotTablePrep')
const { mappingSum } = require('./exportPrep/mappingSum')
 
const exportPrep = cleanedData => {
    console.log(cleanedData)
    const salesOrderMapped = salesOrderMapping(cleanedData)

    const stockAdjMapped = stockAdjMapping(cleanedData)
    const customersMapped = customerMapping(cleanedData)
    const prodMapped = prodMappingUpdate(cleanedData);
    const stockMapped = stockMapping(cleanedData, prodMapped)
    const pivot = pivotTablePrep(cleanedData, prodMapped)
    const mappingSummary = mappingSum(cleanedData, prodMapped)
    console.log(pivot)

    return {
        salesOrder: salesOrderMapped,
        stockOnHand: stockMapped,
        stockAdjustments: stockAdjMapped,
        customers: customersMapped,
        prodMap: prodMapped,
        pivot: pivot,
        mappingSummary: mappingSummary
    }
}


















module.exports = {
    exportPrep
}