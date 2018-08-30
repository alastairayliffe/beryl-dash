



const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { promisify } = require("es6-promisify");

const { unleashedFetchPrepSo } = require('./controllers/salesOrder')
const { unleashedFetchPrepCust } = require('./controllers/customers')
const { unleashedFetchPrepInv } = require('./controllers/inventoryOnHand')
const { getProductMapping } = require('./controllers/productMapping')
const { mappingHash } = require('./controllers/utils')
const {
    createAuthRecord,
    getAuthRecord,
    getCredentials,
    oAuth2ClientInsert
} = require('./controllers/database')


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
const startIntegration = (req, res) => {
    return getCredentials()
        .then(response => authorize(response.credentials, unleashedFetchPrep))
        .then(data => {
            const returnData = (data != undefined ? data.oAuth2Client : 'ok')
            const inclUrl = (data != undefined ? true : false)
            res.status(200).json({
                inclUrl: inclUrl,
                url: returnData,
                credentials: data.credentials,
            })
        })
        .catch(err => {
            return console.log('Error loading client secret file:', err);
        })

}



const authorize = (credentials, callback) => {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );
    return getAuthRecord({ username: 'beryl' })
        .then(response => {
            oAuth2Client.setCredentials(response.gsheet_auth);
            return callback(oAuth2Client);
        })

        .catch(err => {
            return oAuth2ClientInsert({
                username: 'berylOAuth',
                oAuth2Client: oAuth2Client
            })
        })
        .then(response => {
            console.log('oAuth2Client', oAuth2Client)
            return sendBankUrlForAuth(oAuth2Client, credentials)
            // console.log(test)
            //return getNewToken(oAuth2Client, callback)
        })
}

const sendBankUrlForAuth = (oAuth2Client, credentials) => {
    const link = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    return {
        oAuth2Client: link,
        credentials: credentials
    }
}

const newCode = (req, res) => {
    console.log(req.body)
    return getAuthRecord({ username: 'berylOAuth' })
        .then(response => {
            console.log(response)
            let oAuth2ClientNew = response.oauth2client
            const credentials = req.body.credentials;
            
            const {
                client_secret,
                client_id,
                redirect_uris
            } = credentials.installed;
            
            const oAuth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirect_uris[0]
            );

            oAuth2Client.getToken(req.body.newCode, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                createAuthRecord({
                    username: 'beryl',
                    gsheetAuth: token
                })
                    .then(response => {
                        console.log(response)
                        return startIntegration();
                    })
    
            });


        })
}


const getNewToken = (oAuth2Client, callback) => {
    console.log(' getNewToken', oAuth2Client)
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            createAuthRecord({
                username: 'beryl',
                gsheetAuth: token
            })
                .then(response => {
                    console.log(response)
                    return callback(oAuth2Client);
                })

        });
    });
}

const unleashedFetchPrep = async (auth) => {
    let mappingRows = []
    let customerData = [];
    return getProductMapping(auth, 'product-mapping!A2:E')
        .then(response => {
            console.log('product mapping')
            
            mappingRows = (response != undefined ? response : []);
            return unleashedFetchPrepCust(auth)
        })
        .then(resCustData => {
            console.log('customer data')
            customerData = resCustData;
            return unleashedFetchPrepInv(auth, mappingRows)
        })
        .then(inventory => {
            console.log('inventory')
            return unleashedFetchPrepSo(auth, mappingRows, customerData)
        })
        .catch(err => {
            console.log('The API returned an error: ' + err);
        })
}



module.exports = {
    startIntegration,
    newCode
}








