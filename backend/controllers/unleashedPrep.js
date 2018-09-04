const fetch = require('node-fetch');
const moment = require('moment');
const { google } = require('googleapis');
const { testingFunc } = require('./testing')

const {
    fetchGetUnleashed,
    itemsToGs
} = require('./api')

const unleashedWithPage = (auth, unleashedApi) => {
    let finalCustArray = []
    return unleashedData(auth, unleashedApi, '1')
        .then(data => {
            const testing = testingFunc()
            const numberOfPages = Math.ceil(data.Pagination.NumberOfItems / 1000)
            let promises = [];
            let pageNum = (testing === true) ? 2 : numberOfPages;
            let pageSize = (testing === true) ? 2 : 1000;
            for (i = 1; i < pageNum + 1; i++) {
                promises.push(unleashedData(auth, unleashedApi, pageSize, (i)))
            }
            return Promise.all(promises)
        })
}

const unleashedNoPage = (auth, unleashedApi) => {
    return unleashedData(auth, unleashedApi, '1000')
}

const unleashedData = (auth, api, pageSize, pageNum) => {
    return fetchGetUnleashed(auth, api, pageSize, pageNum)
        .then (data => data)
        .catch(err => console.log('err', err))
}

module.exports = {
    unleashedWithPage,
    unleashedNoPage
}