/**
 * @Author  wqiong
 * @Date    2018-05-25T10:19:39+08:00
 * @Description 落地页路由模块
 */

const FileController = require('../controllers/file.server.controller');

module.exports = function(app){
  app.get('/adveditor/api/file/upload/key', FileController.getUploadKey);
  app.post('/adveditor/api/file/upload/callback', FileController.qiniuCallback);

  // app.get('/api/file/getDownloadUrl', FileController.getDownloadUrlSecure);
};
