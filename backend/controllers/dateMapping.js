
const { itemsFromGs } = require('./api')
const { google } = require('googleapis');
const { promisify } = require("es6-promisify");


const getDateMapping = async (auth, range) => {
    const sheets = google.sheets({ version: 'v4' });
    const asyncAppend = promisify(sheets.spreadsheets.values.get, sheets.spreadsheets.values);
    return asyncAppend({
        auth: auth,
        spreadsheetId: '1g3C8Ocm_ncRQsrXsqwI1-8BfVh_eICmuWb_G1Hno2g8',
        range: range,
    })
        .then(res => {
            console.log(res)
            return res.data.values;
        })
        .catch(err => {
            console.log('The API returned an error: ' + err);
            return;
        })

}

module.exports = {
    getDateMapping
}
