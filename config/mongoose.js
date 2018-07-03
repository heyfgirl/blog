/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description mongoose配置模块
 */
const mongoose = require('mongoose');
const config = require('./config');
const models = require("./mongoose.models");//加载models

const connection = mongoose.createConnection(config.mongodb, {autoReconnect: true});

connection.on('error', function(err){
  if(err){
    console.log('err:', err.message);
  }
});

// ===== model schema import ======
connection.models = models(connection);
// ================================

//监听链接
connection.on('connecting', function(err, msg){
  console.log('connecting: ',err, msg);
});
connection.on('disconnected', function(err, msg){
  console.log('disconnected: ',err, msg);
});
connection.on('connected', function(err, msg){
  console.log('connected: ',err, msg);
});
connection.on('disconnecting', function(err, msg){
  console.log('disconnecting: ',err, msg);
});

module.exports = connection;