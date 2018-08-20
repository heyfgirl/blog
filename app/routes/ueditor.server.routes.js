/**
 * @Author  wqiong
 * @Date    2018-05-29T11:50:39+08:00
 * @Description 用户登陆注册注销等路由
 */

let router = require('express').Router();
const UeditorController = require("../controllers/file/ueditor.server.controller");

//获取配置文件
router.get('/api/ueditor/config', /*UserController.auth.loadSession,*/ UeditorController.getConfig);
//上传图片
router.post('/api/ueditor/config', /*UserController.auth.loadSession,*/ UeditorController.uploadImg);

module.exports = router;