/**
 * @Author  wqiong
 * @Date    2018-05-25T10:19:39+08:00
 * @Description 邮件服务
 */

const router = require('express').Router();
const MailController = require('../controllers/mail/mail.server.controller');

//上传文件
router.post('/api/exmail', /*UserController.auth.loadSession,*/ MailController.loginAuth);
router.get('/api/exmail/login', /*UserController.auth.loadSession,*/ MailController.login);

module.exports = router;
