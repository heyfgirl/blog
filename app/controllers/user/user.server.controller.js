/**
 * @Author  wqiong
 * @Date    2018-05-29T16:49:59+08:00
 * @Description 用户登录，注册相关操作
 */
const loginManageImp = require('./loginManage.user.server.controller');
const authImp = require('./auth.server.controller');
const sysLibs = require("../../libs/gen.result");
const mongoose = require("../../../config/mongoose");
const errCode = require("../../../config/errorcode");
const commonFunction = require('../../utils/commonFunction');

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
    //
    if(!req.body.email && !req.body.mobile){
      return next(sysLibs.err('未传入邮箱或者手机参数', errCode.PARAM.DEFECT));
    }
    if(!req.body.password){
      return next(sysLibs.err('未传入密码', errCode.PARAM.DEFECT));
    }
    //生成4位数的盐
    let salt = commonFunction.randomString(4);
    req.body.password = commonFunction.md5String(req.body.password + salt);
    req.body.salt = salt;
    mongoose.models.User.create(req.body, function(err, doc){
      if(err){
        return next(sysLibs.err(err.message));
      }
      req.result = sysLibs.response(doc);
      return next();
    });
  },
    /**
   * @api {get} /adveditor/api/landingpage/user/info 获取用户信息
   * @apiName user/userInfo
   * @apiGroup loginManage
   * @apiVersion 0.0.1
   *
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
            "result": "success",
            "data": {
              "id": 114,
              "username": "wqiong",
              "nickname": "王琼",
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
  userInfo: function (req, res, next) {
    req.result = sysLibs.response(req.userInfo);
    return next();
  },
};