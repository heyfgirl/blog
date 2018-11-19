/**
 * @Author  wqiong
 * @Date    2018-05-25T10:19:39+08:00
 * @Description 邮件服务
 */

const router = require('express').Router();
const MoneyController = require('../controllers/pay/money.server.controller');

//上传文件
router.post('/api/pay', /*UserController.auth.loadSession,*/ MoneyController.payment);
router.get('/api/pay', /*UserController.auth.loadSession,*/ MoneyController.payment);
//两数之和
router.get('/api/twoNumber', /*UserController.auth.loadSession,*/ MoneyController.twoNumber);
//无重复字符的最长子串
router.get('/api/LongestString', /*UserController.auth.loadSession,*/ MoneyController.LongestString);
//正则测试
router.get('/api/regex', /*UserController.auth.loadSession,*/ MoneyController.reversalInt);


router.get('/api/twoTree', /*UserController.auth.loadSession,*/ MoneyController.twoTree);
router.get('/api/testTree', /*UserController.auth.loadSession,*/ MoneyController.testTree);

module.exports = router;
