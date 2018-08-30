const express = require('express')
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const CryptoJS = require("crypto-js");
const fetch = require('node-fetch');
const { 
	startIntegration,
newCode 
} = require('./backend/unleashedGs')
const { PORT } = require('./backend/configs/backend');
const config = require('./backend/configs/backend');
const { sendIndexHtml} = require('./backend/configs/indexHtml');

let app = express()



app
.get('*.js', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
  	})
	.use('/build', express.static('build'))
	.use(bodyParser.json())
	.use(cookieParser())
	.get('/get/refresh', startIntegration )
	.post('/post/newCode', newCode)
	.get('/*', sendIndexHtml)
	.listen(config.PORT, '0.0.0.0', () => {
		console.log(`Starting on port ${config.PORT}.`);
		console.log(`PUBLIC PATH ${config.PUBLIC_PATH}.`);
	});
