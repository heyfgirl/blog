/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description mongoose配置模块
 */
const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.mongodb, {autoReconnect: true});
connection.on('error', function(err){
  if(err){
    console.log(`connected => 启动数据库出现错误; err => ${err}`);
  }
});
// ===== model schema import ======
connection.models = require("./load.models")(connection);
// ==========加载model结束===========

//监听链接
connection.on('connecting', function(err, msg){
  console.log('connecting: ',err, msg);
});
connection.on('disconnected', function(err, msg){
  console.log('disconnected: ',err, msg);
});
connection.on('connected', function(err){
  if(err){
    console.log(`connected => 启动数据库出现错误; err => ${err}`);
  }else{
    console.log('connected: ', "启动数据库完成!");
  }
});
connection.on('disconnecting', function(err, msg){
  console.log('disconnecting: ',err, msg);
});

module.exports = connection;