const readline = require('readline');
const { google } = require('googleapis');
const { promisify } = require("es6-promisify");

const { cleanData } = require('./controllers/cleanData')
const { exportPrep } = require('./controllers/exportPrep')
const { 
    itemsToGs,
    gsPrep,
    gsClear
} = require('./controllers/api')

const {
    createAuthRecord,
    getAuthRecord,
    getCredentials,
    oAuth2ClientInsert
} = require('./controllers/database')
const {
    unleashedWithPage,
    unleashedNoPage
} = require('./controllers/unleashedPrep')


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

const unleashedFetchPrep = async (auth) => {
    let allFetchedData = {};
    return Promise.all([
        unleashedWithPage(auth, 'SalesOrders'),
    ])
        .then(results => {
            console.log(results)
            allFetchedData.salesOrders = results
            return Promise.all([
                unleashedWithPage(auth, 'StockOnHand'),
                unleashedWithPage(auth, 'Customers'),
                unleashedNoPage(auth, 'StockAdjustments'),
                gsPrep(auth, 'product-mapping!A2:E'),
                gsPrep(auth, 'projections!A2:H'),
                gsPrep(auth, 'date-mapping!A2:J'),
                gsPrep(auth, 'projection-adjustments!A2:G'),

            ])
        })
        .then(unleashedResponse => {
            allFetchedData.stockOnHand = unleashedResponse[0]
            allFetchedData.customers = unleashedResponse[1]
            allFetchedData.stockAdjustments = unleashedResponse[2]
            allFetchedData.productMapping = unleashedResponse[3]
            allFetchedData.projections = unleashedResponse[4]
            allFetchedData.dateMapping = unleashedResponse[5]
            allFetchedData.projectionsAdj = unleashedResponse[6]
            
            return Promise.all([
                gsClear(auth, 'product-mapping!A2:E'),
                gsClear(auth, 'customers!A2:D'),
                gsClear(auth, 'inventory!A2:N'),
                gsClear(auth, 'sales-orders!A2:AE'),
                gsClear(auth, 'adjustments!A2:X'),
                gsClear(auth, 'pivot!A2:V'),
            ])


        })
        .then(()=> {
            return cleanData(allFetchedData)
        })
        .then(cleanedData => exportPrep(cleanedData))
        .then(cleanedData => {
            console.log('pivot', cleanedData.pivot.export)
            return Promise.all([
                itemsToGs(auth, cleanedData.customers, 'customers!A2:D'),
                itemsToGs(auth, cleanedData.stockOnHand, 'inventory!A2:N'),
                itemsToGs(auth, cleanedData.pivot.export, 'pivot!A2:V'),
                itemsToGs(auth, cleanedData.prodMap.export, 'product-mapping!A2:E'),
                itemsToGs(auth, cleanedData.salesOrder, 'sales-orders!A2:AF'),
                itemsToGs(auth, cleanedData.stockAdjustments, 'adjustments!A2:Y')
            ])
         })
        .catch(err => {
            console.log('The API returned an error: ' + err);
        })
}



module.exports = {
    startIntegration,
    newCode
}





