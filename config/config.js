let config = require('./env/common');

let envConfig = null;
if(process && process.env && process.env.NODE_ENV) {
  envConfig = require('./env/' + process.env.NODE_ENV);
} else {
  envConfig = require('./env/development');
}

Object.keys(envConfig).forEach(function(key){
  config[key] = envConfig[key];
});
// config.envConfig = envConfig;

module.exports = config;
