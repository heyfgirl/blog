/**
 * @Author  wqiong
 * @Date    2018-05-29T16:49:59+08:00
 * @Description 用户登录，注册相关操作
 */
var loginManageImp = require('./loginManage.user.server.controller');
var authImp = require('./auth.server.controller');

module.exports = {
  loginManage: loginManageImp,
  auth: authImp
};