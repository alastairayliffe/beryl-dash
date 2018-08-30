const mappingHash = productRows => {
    let newHashedObj = {}
     productRows.forEach(row => {
        let hashedValue = row[2]
        let hashedObj = {
            productCode: row[0],
            productDescription: row[1],
            productGuid: row[2],
            productGroupName: row[3],
            productMapping:row[4]
        }
        newHashedObj[hashedValue] = hashedObj
    })
    return newHashedObj
}

const customerHash = customerData => {
    let newCustomerHashObj = {}
    customerData.forEach(rowCust => {
        let hashedCustValue = rowCust[2]
        let hashedCustObj = rowCust[1]
        newCustomerHashObj[hashedCustValue] = hashedCustObj
    })

    return newCustomerHashObj
}

module.exports = {
    mappingHash,
    customerHash
}