const moment = require('moment');




const salesOrderHashed = salesOrderArray => {
    let salesOrdersNew = {
        byHash: {},
        byId: []
    }
    if (salesOrderArray!= undefined &&  salesOrderArray.length > 0) {
        salesOrderArray.forEach(salesOrderPage => {
            salesOrderPage.Items.forEach(salesOrder => {
                const orderDateNew = parseInt(salesOrder.OrderDate.replace('/Date(', '').replace(')/', ''))
                const orderDateNewFormatted = moment(orderDateNew).format("MM/DD/YYYY")
                const orderDateGSFormat = parseInt(25569 + ((orderDateNew / 1000 / 60 / 60 / 24)))
                const salesPersonAdj = salesOrder.SalesOrderGroup
                const taxRate = (1 + salesOrder.TaxRate)


                salesOrder.SalesOrderLines.forEach(salesOrderLine => {
                    let salesOrderLineGuid = salesOrderLine.Guid

                    let salesOrderTrim = {
                        orderDateNewFormatted: orderDateNewFormatted,
                        orderNumber: salesOrder.OrderNumber,
                        orderStatus: salesOrder.OrderStatus,
                        salesOrderType: salesPersonAdj,
                        customerCode: salesOrder.Customer.CustomerCode,
                        customerName: salesOrder.Customer.CustomerName,
                        customerGuid: salesOrder.Customer.Guid,
                        lineNumber: salesOrderLine.LineNumber,
                        lineType: salesOrderLine.LineType,
                        productGuid: salesOrderLine.Product.Guid,
                        productCode: salesOrderLine.Product.ProductCode,
                        productDescription: salesOrderLine.Product.ProductDescription,
                        orderQuantity: salesOrderLine.OrderQuantity,
                        unitPrice: (salesOrderLine.UnitPrice / taxRate),
                        discountRate: salesOrderLine.DiscountRate,
                        lineTotal: (salesOrderLine.LineTotal / taxRate),
                        guid: salesOrderLine.Guid,
                        UnitPrice: salesOrderLine.UnitPrice,
                        orderDateGSFormat: orderDateGSFormat
                    }

                    salesOrdersNew.byHash[salesOrderLineGuid] = salesOrderTrim
                    salesOrdersNew.byId.push(salesOrderLineGuid);

                })

            })
        })
    }
    return salesOrdersNew;

}

module.exports = {
    salesOrderHashed
}
