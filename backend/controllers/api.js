const { hash64Func } = require('./unleashedAuth')
const { google } = require('googleapis');
const fetch = require('node-fetch');
const { promisify } = require("es6-promisify");


const fetchGetUnleashed = (auth, endpoint, pageSize, pageNum) => {
    let urlParam = "pageSize=" + pageSize ;
    let dataType = (pageNum != undefined ? endpoint + '/Page/' + pageNum + '?': endpoint + '?')
    let url = "https://api.unleashedsoftware.com/" + dataType + urlParam;
    let hash64 = hash64Func(urlParam);

    console.log(url)
    return fetch(url, {
        headers: {
            'Accept': 'application/json',
            'api-auth-id': '499486ee-6519-4741-9aaa-6860f5cb08bb',
            'api-auth-signature': hash64,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data)
        .catch(err => console.log('err', err))
  
};

const itemsToGs = (auth, lines, range ) => {
    const sheets = google.sheets({ version: 'v4' });
    return sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: '1g3C8Ocm_ncRQsrXsqwI1-8BfVh_eICmuWb_G1Hno2g8',
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: lines
        }
    }, (err, res) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            return;
        }
    });
}

const gsPrep = async (auth, range) => {
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

const gsClear = async (auth, range) => {
    const sheets = google.sheets({ version: 'v4' });
    const asyncAppend = promisify(sheets.spreadsheets.values.clear, sheets.spreadsheets.values);
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
    fetchGetUnleashed,
    itemsToGs,
    gsPrep,
    gsClear 
}