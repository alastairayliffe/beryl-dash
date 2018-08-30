'use strict';

[
	'PORT',
	'DATABASE',
	'USERNAME',
	'PASSWORD',
].forEach( env => {
	if (!process.env[env]) {
		console.log(`Can't run Travelogue: ${env} not set.`);
		process.exit(1);
	}
});

const port = process.env.PORT_DB;
const name = process.env.DATABASE;
const user = process.env.USERNAME;
const pass = process.env.PASSWORD;

module.exports = {
	DB_URL: `postgres://${user}:${pass}@localhost:${port}/${name}`,
};

