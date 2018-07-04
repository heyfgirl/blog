/**
 * @Author  wqiong
 * @Date    2018-05-29T11:50:39+08:00
 * @Description 用户登陆注册注销等路由
 */

const UserController = require('../controllers/user/user.server.controller');
let router = require('express').Router();

router.post('/create', /*UserController.auth.loadSession,*/ UserController.create);
router.post('/login', UserController.loginManage.checkLoginLog, UserController.loginManage.login);
router.post('/info', UserController.auth.loadSession, UserController.userInfo);

module.exports = router;
