//#!/usr/bin/env node

const app = require('../app');
const config = require('../config/config');
app.listen(config.port, function(){
  console.log('Express listening on port:', config.port);
});

//const waterline = require('../config/waterline');
//waterline.orm.initialize(waterline.config, function(err, models){
//  if(err) {
//    console.log('waterline initialize failed, err:', err);
//    return;
//  }
//  console.log('waterline initialize success.');
//  waterline.models = models.collections;
//
//  // 其他初始化挂载点
//
//  app.listen(config.port, function(){
//    console.log('Express listening on port:', config.port);
//  });
//});
