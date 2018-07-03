const Waterline = require('waterline');
const mongoAdapter = require('sails-mongo');
const mysqlAdapter = require('sails-mysql');
const config = require('./config');

// models
const LandingPage = require("../app/models/landingpage.server.model");
const Post = require("../app/models/post.server.model");
const orm = new Waterline();
const wlconfig = {
  adapters: {
    'default': mongoAdapter,
    mongo: mongoAdapter,
    // mysql: mysqlAdapter
  },
  connections: {
    'mongo': {
      adapter: 'mongo',
      url: config.mongo
    }/*,
    'mysql': {
      adapter: 'mysql',
      url: config.mysql,
      charset   : 'utf8',
      collation : 'utf8_general_ci'
    }*/
  }
};

orm.loadCollection(LandingPage);
orm.loadCollection(Post);
exports.orm = orm;
exports.config = wlconfig;
exports.models = null;
