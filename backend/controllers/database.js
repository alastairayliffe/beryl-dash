const pgp = require('pg-promise')();
const backendConfig = require('../configs/backend');
const db = pgp(backendConfig.DB_URL);


//add Id in here
const createAuthRecord = (authRecord) => {
    console.log('db',authRecord )
    return db.one('INSERT INTO gsheet_auth (username, gsheet_auth) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT gsheet_auth_username_key DO UPDATE set gsheet_auth=$2 RETURNING *', [authRecord.username, authRecord.gsheetAuth]);
  }

  const oAuth2ClientInsert = (details) => {
    return db.one('INSERT INTO gsheet_auth (username, oAuth2Client) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT gsheet_auth_username_key DO UPDATE set oAuth2Client=$2 RETURNING *', [details.username, details.oAuth2Client]);
  }

const getAuthRecord = (username) => {
    return db.one('select * FROM gsheet_auth where username=$1', [username.username]);
  }

  const getCredentials = (username) => {
    return db.one('select * FROM credentials');
  }
  
module.exports = {
    createAuthRecord,
    getAuthRecord,
    getCredentials,
    oAuth2ClientInsert 
}