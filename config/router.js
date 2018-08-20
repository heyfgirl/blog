/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description 功能模块路由配置
 */

module.exports = function(app){
  //菜单页面
  app.use(require("../app/routes/page.server.routes"));
  //帖子页面
  app.use(require("../app/routes/post.server.routes"));

  //api路由
  app.use(require("../app/routes/auth.server.routes"));
  app.use(require("../app/routes/user.server.routes"));
  app.use(require("../app/routes/ueditor.server.routes"));
};
