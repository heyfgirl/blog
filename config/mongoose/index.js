/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description mongoose配置模块
 */
const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.mongodb, {autoReconnect: true});

// ===== model schema import ======
connection.models = require("./load.models")(connection);
// ==========加载model结束===========

//监听链接
connection.on('connected', function(err){
  if(err){
    console.log(`启动数据库失败: err => ${err}`);
  }else{
    console.log("启动数据库完成!");
  }
});
connection.on('error',function(err) {
  console.log(`数据库链接失败: err=> ${err}`);
});
connection.on('disconnecting', function(err, msg){
  console.log(`数据库断开链接: err=> ${err}, msg=> ${msg}`);
});

module.exports = connection;