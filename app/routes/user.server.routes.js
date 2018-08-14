/**
 * @Author  wqiong
 * @Date    2018-05-29T11:50:39+08:00
 * @Description 用户登陆注册注销等路由
 */

const UserController = require('../controllers/user/user.server.controller');
let router = require('express').Router();

router.post('/api/user/create', /*UserController.auth.loadSession,*/ UserController.create);
router.get('/api/user/info', UserController.auth.loadSession, UserController.userInfo);
router.post('/api/user/blocked', /*UserController.auth.loadSession,*/ UserController.blockedAccount);
router.post('/api/user/delete', /*UserController.auth.loadSession,*/ UserController.deleteAccount);

module.exports = router;
