
const stockOnHandHashed = stockOnHandArray => {
    let stockOnHandNew = {
        byHash: {},
        byId: []
    }
    if (stockOnHandArray!= undefined &&  stockOnHandArray.length > 0) {
        stockOnHandArray.forEach(stockOnHandPage => {
            stockOnHandPage.Items.forEach(product => {
                let stockLineGuid = product.Guid
                let stockLineTrim = {
                    productCode: product.ProductCode,
                    productDescription: product.ProductDescription,
                    productGuid: product.ProductGuid,
                    productGroupName: product.ProductGroupName,
                    warehouseId: product.WarehouseId,
                    warehouse: product.Warehouse,
                    warehouseCode: product.WarehouseCode,
                    onPurchase: product.OnPurchase,
                    allocatedQty: product.AllocatedQty,
                    availableQty: product.AvailableQty,
                    qtyOnHand: product.QtyOnHand,
                    avgCost: product.AvgCost,
                    guid: product.Guid
                }

                stockOnHandNew.byHash[stockLineGuid] = stockLineTrim
                stockOnHandNew.byId.push(stockLineGuid);
            })
        })
    }
    return stockOnHandNew;
}

module.exports = {
    stockOnHandHashed
}