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

module.exports = router;
