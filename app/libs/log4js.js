const config = require('../../config/config');
const moment = require('moment');

const log4js = require('log4js');

const logger = log4js.getLogger();

const logLevel = config.logLevel ? config.logLevel : 'DEBUG';
// logger.level = logLevel;
logger.setLevel(logLevel);

module.exports = logger;
