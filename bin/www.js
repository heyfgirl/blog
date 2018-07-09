//#!/usr/bin/env node

const app = require('../app');
const config = require('../config/config');

const cluster = require('cluster');
const numCPUs = require("os").cpus().length;
const Process = [];
if (cluster.isMaster) {
  for(let i = 0; i < numCPUs; i++){
    const worker = cluster.fork();
    Process.push(worker);
    worker.send('hi there');
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died' + signal);
  });
  console.log(cluster.workers);
}else{
  app.listen(config.port, function(){
    console.log('Express listening on port:', config.port);
  });
}

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
