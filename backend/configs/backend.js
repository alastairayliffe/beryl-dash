'use strict';

const stage = process.env.NODE_ENV || 'development';
const serverConfig = require(`./server/${stage}`);
const databaseConfig = require(`./database/${stage}`);
const config = { ...serverConfig, ...databaseConfig };


module.exports = config;


