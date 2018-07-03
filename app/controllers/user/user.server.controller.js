/**
 * @Author  wqiong
 * @Date    2018-05-29T16:49:59+08:00
 * @Description 用户登录，注册相关操作
 */
const loginManageImp = require('./loginManage.user.server.controller');
const authImp = require('./auth.server.controller');
// const mongoose = require("../../../config/mongoose/mongoose");

module.exports = {
  loginManage: loginManageImp,
  auth: authImp,
  /**
   * @api {post} /api/user/user/add 添加用户
   * @apiName user/Add
   * @apiGroup user
   * @apiVersion 0.0.1
   *
   * @apiParam {String} name  用户姓名
   * @apiParam {String} [sex] 用户性别 1是男2是女
   * @apiParam {Json} [nickname]  用户昵称
   *
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
            "result": "success",
            "data": {
              id: "uid_123456789"
            },
            "errCode": 200
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
  */
  create: function(req, res, next){
    // let 
    console.log(req.render);
    return res.json({dd:555});
  }
};