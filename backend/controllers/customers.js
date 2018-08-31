const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')
const { 
    fetchGetUnleashed, 
    itemsToGs 
} = require('./api')



const unleashedFetchPrepCust = (auth) => {
    let finalCustArray = []
    return unleashedData(auth, '1')
        .then(data => {
            const testing = testingFunc()
            const numberOfPages = Math.ceil(data.Pagination.NumberOfItems / 1000)
            let promises = [];
            let pageNum = (testing === true) ? 2 : numberOfPages;
            let pageSize = (testing === true) ? 2 : 1000;
            for (i = 1; i < pageNum+1; i++) {
                promises.push(unleashedData(auth, pageSize, (i)))
            }

            return Promise.all(promises)
           
            })
        .then(allData => {
            
            allData.forEach(groupCust => {
                finalCustArray.push(...groupCust)
            })
            return itemsToGs(auth, finalCustArray,'customers!A2:D' )
        })
        .then(data => {
            return finalCustArray;
        })

}





const unleashedData = (auth, pageSize, pageNum) => {
    return fetchGetUnleashed(auth, 'Customers', pageSize, pageNum )
        .then(data => {
            if (pageNum === undefined) {
                return data
            } else {
                return inventoryCustomerPrep(data)
            }
        })
        .catch(err => console.log('err', err))

}

const inventoryCustomerPrep = (customers) => {

    return customers.Items.map(customer => {
        let country = ''
        customer.Addresses.forEach(address => {
            country = address.Country
        })
        return [
            customer.CustomerCode,
            customer.CustomerType,
            customer.Guid,
            country
        ]

    })
}


module.exports = {
    unleashedFetchPrepCust
}