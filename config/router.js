/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description 功能模块路由配置
 */

//数据获取的API路由
function apiRoute(app){
  app.use('/api/auth', require("../app/routes/auth.server.routes"));
  app.use('/api/user', require("../app/routes/user.server.routes"));
}

//渲染页面的VIEW路由
function viewRoute(app){
  //主页页面
  app.get('/', require("../app/controllers/page/home.server.controller").index);
  //菜单页面
  app.use('/view/page', require("../app/routes/page.server.routes"));
  //帖子页面
  app.use('/view/post', require("../app/routes/post.server.routes"));
}

module.exports = function(app){
  viewRoute(app);
  //api路由
  apiRoute(app);
};
