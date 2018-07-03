
const express = require('express');

//数据获取的API路由
function apiRoute(app){
  app.use('/api/user', require("../../app/routes/user.server.routes"));
}

//渲染页面的VIEW路由
function viewRoute(app){
  //主页页面
  app.use('/', require("../../app/routes/page.server.routes"));
  //帖子页面
  app.use('/post', require("../../app/routes/post.server.routes"));
}

module.exports = function(app){
  viewRoute(app);
  //api路由
  apiRoute(app);
};
