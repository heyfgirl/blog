/**
 * @Author  wqiong
 * @Date    2018-05-24T10:19:39+08:00
 * @Description 落地页路由模块
 * 增 删 改 查 列表 发布 预览
 */

const LandingPageController = require('../controllers/landingpage/editor.server.controller');
const PreviewLandingPageController = require('../controllers/landingpage/preview.server.controller');
const UserController = require('../controllers/user/user.server.controller');
// const config = require('../../config/config');
// const sysLibs = require('../libs/libs');

module.exports = function (app) {
  app.post('/adveditor/api/landingpage/add', UserController.auth.loadSession, LandingPageController.addLandingPage);
  app.post('/adveditor/api/landingpage/info', UserController.auth.loadSession, LandingPageController.infoLandingPage);
  app.post('/adveditor/api/landingpage/del', UserController.auth.loadSession, LandingPageController.delLandingPage);
  app.post('/adveditor/api/landingpage/update', UserController.auth.loadSession, LandingPageController.updateLandingPage);
  app.post('/adveditor/api/landingpage/list', UserController.auth.loadSession, LandingPageController.listLandingPage);

  app.post('/adveditor/api/landingpage/publish', UserController.auth.loadSession, PreviewLandingPageController.publishLandingPage);
  app.post('/adveditor/api/landingpage/publishAll', UserController.auth.loadSession, PreviewLandingPageController.publishLandinAllgPage);
  // 预览
  app.get('/adveditor/view/landingpage/preview', PreviewLandingPageController.previewLandingPage);//UserController.auth.loadSession,
};
