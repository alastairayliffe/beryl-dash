



const customerHashed = customersArray => {
    let customersNew = {
        byHash: {},
        byId: []
    }
    if (customersArray!= undefined &&  customersArray.length > 0) {
        customersArray.forEach(customerPage => {
            customerPage.Items.forEach(customer => {
                let country = ''
                customer.Addresses.forEach(address => {
                    country = address.Country
                })
                let customerGuid = customer.Guid
                let customerTrim = {
                    customerCode: customer.CustomerCode,
                    customerType: customer.CustomerType,
                    guid: customer.Guid,
                    country: country
                }
                customersNew.byHash[customerGuid] = customerTrim
                customersNew.byId.push(customerGuid);
            })
        })
    }
    return customersNew;
}

module.exports = {
    customerHashed
}