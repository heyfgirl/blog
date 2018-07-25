/**
 * @Author  wqiong
 * @Date    2018-05-29T11:50:39+08:00
 * @Description 用户登陆注册注销等路由
 */

const UserController = require('../controllers/user/user.server.controller');
let router = require('express').Router();

router.post('/create', /*UserController.auth.loadSession,*/ UserController.create);
router.get('/info', UserController.auth.loadSession, UserController.userInfo);
router.post('/blocked', /*UserController.auth.loadSession,*/ UserController.blockedAccount);
router.post('/delete', /*UserController.auth.loadSession,*/ UserController.deleteAccount);

module.exports = router;
