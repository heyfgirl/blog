/**
 * @Author  wqiong
 * @Date    2018-05-29T16:49:59+08:00
 * @Description 用户登录，注册相关操作
 */
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const config = require('../../../config/config');
const redis = require('../../libs/redisSdk').client;
const sysLibs = require('../../libs/libs');
const request = require('request');
const errCode = require("../../../config/errorcode");
const mongoose = require("../../../config/mongoose");
const commonFunction = require('../../utils/commonFunction');
const logger = require("../../libs/log4js");

module.exports = {
  /**
   * @api {post} /adveditor/api/landingpage/user/login 对接crm登录接口
   * @apiName user/login
   * @apiGroup loginManage
   * @apiVersion 0.0.1
   *
   * @apiDescription
   * vsf 表示客户登录的来源，需要设置在 headers 中,
   * 默认会采用 'web' 类型。
   *
   * @apiParam {String} user 用户标识，可以是用户名，也可以是手机号
   * @apiParam {String} password 密码,MD5加密之后的字符串
   * @apiParam {String} vsf 用户登录来源，默认为['web'],设置在headers中
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
            "result": "success",
            "data": {
                "token":''
                "userInfo":{
                  "id": 114,
                  "username": "wqiong",
                  "nickname": "王琼",
                }
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
  login: function (req, res, next) {
    if (!req.body.user) return next(sysLibs.err('没有提供用户登录名或者手机号信息'));
    if (!req.body.password) return next(sysLibs.err('没有提供密码信息'));
    var vsf = req.headers.vsf ? req.headers.vsf : 'web';
    let query={
      $or:[{email: req.body.user}, {mobile: req.body.user}, {username: req.body.user}],
    };
    mongoose.models.User.findOne(query, function(err, uInfo){
      if(err) return next(sysLibs.err(err.message));
      if(!uInfo) return next(sysLibs.err("查询不到该账号用户信息"));
      let password = commonFunction.md5String(req.body.password + uInfo.salt);
      // let password = req.body.password;
      if(password !== uInfo.password){
         // 密码错误，记录缓存限制信息，返回错误
         updateRedisLockFlag(req.body.user);
         logger.error("用户登陆密码错误  [user]:", req.body.user, "[password]:", req.body.password);
         return next(sysLibs.err("密码错误"));
      }else{
        updateRedisLockFlag(req.body.user,true);
        // 设置token过期时间
        let t_exp = parseInt(moment().startOf('day').add(1, 'day').valueOf() / 1000);
        let tokenInfo = {
          uid: uInfo.id, //用户Id
          f: uuid(), //tokenId
          exp: t_exp, //过期时间
          vsf: vsf //登陆来源
        };
        let token = jwt.sign(tokenInfo, config.JWT_secret);
        uInfo.checkInfo = { key: vsf, value: tokenInfo.f, exp: tokenInfo.exp }; //token的校验信息 临时存储在用户信息中
        t_login(uInfo, function(err){
          if(err) return next(sysLibs.err(err.message));
          req.result = sysLibs.response(token);
          return next();
        });
      }
    });
  },
  /**
   * 检查登录限制日志中间件，主要负责尝试失败次数过多之后的限制登录问题
   *
   * {
      cnt: 1, // 尝试次数
      at: 12839237219 // 最后一次尝试时间戳
     }
    * @apiErrorExample 超时示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        "result": "error",
        "data": "登录失败次数过多，请稍后尝试(838.586s)",
        "errCode": 500
      }
   *
   */
  checkLoginLog: function (req, res, next) {
    // logger.warn('TOUCH HERE (checkLoginLog)');
    if (!req.body.user) return next(sysLibs.err('没有提供用户登录名或者手机号信息', errCode.PARAM.DEFECT.code));
    if (!req.body.password) return next(sysLibs.err('没有提供密码信息', errCode.PARAM.DEFECT.code));
    redis.hget(config.login.redisLockedFlag, req.body.user, function (err, rltLoginLockFlag) {
      // logger.debug(err, rltLoginLockFlag);
      if (err) return next(sysLibs.err(err.message));
      // 查询不到相关限制标记，直接返回，允许后续登录操作
      if (!rltLoginLockFlag) return next();
      try {
        rltLoginLockFlag = JSON.parse(rltLoginLockFlag);
      } catch (e) {
        return next(sysLibs.err(e.message));
      }
      // 尝试次数小于配置的最大尝试次数，直接返回正常登录流程
      if (rltLoginLockFlag.cnt < config.login.loginTryTimes) return next();
      /**
       * 尝试次数大于等于配置的最大尝试次数
       * 1. 超过限定时间，清空缓存记录，返回正常登录流程
       * 2. 还在限制时间之内，不允许登录
       */
      if (moment().valueOf() - rltLoginLockFlag.at > config.login.loginDelayTime) {
        // logger.debug('before ');
        redis.hdel(config.login.redisLockedFlag, req.body.user);
        return next();
      } else {
        // sysLog('user', 'login', '[post]/gm/user/login', req.body.user, '登录失败次数过多');
        return next(sysLibs.err(`登录失败次数过多，请稍后尝试(${(config.login.loginDelayTime - moment().valueOf() + rltLoginLockFlag.at) / 1000}s)`));
      }
    });
  },
};
/**
 * 调用crm请求接口
 * options:{
 *  hostname : 'test.czbapp.com',
    port :  80,
    path : '/crmdev/gm/user/userInfo',
    method : 'get',
    headers:{
      "vsf":'web',
      "Content-Type":"application/x-www-form-urlencoded",
    },
    params:{
    }
  }
 *
 */
function requestData(options, callback) {
  var option = {
    url: options.url,
    headers: options.headers,
    method: options.method,
    form: options.params,
    timeout: 10000,
  };
  request(option, function (error, response, body) {
    if (error) {
      return callback(error);
    }
    try {
      body = JSON.parse(body);
      callback(null, body);
    } catch (err) {
      callback(err);
    }
  });
}

/**
 * 登录密码错误，更新缓存限制信息函数
 * update Wqiong 2018-05-30T13:49:27+08:00
 */
function updateRedisLockFlag(userKey, ifRight) {
  if (ifRight) {
    // 密码正确时需要清除redis中的标志信息
    redis.hdel(config.login.redisLockedFlag, userKey);
    return;
  }
  redis.hget(config.login.redisLockedFlag, userKey, function (err, rltLoginLockFlag) {
    if (err) {
      // logger.error(`[Redis] get login locked flag error: ${err.message}`);
      return;
    }
    if (!rltLoginLockFlag) {
      // 查询不到限制信息，需要新建
      redis.hset(config.login.redisLockedFlag, userKey, JSON.stringify({ cnt: 1, at: moment().valueOf() }));
      return;
    }
    try {
      rltLoginLockFlag = JSON.parse(rltLoginLockFlag);
    } catch (e) {
      // logger.error(`[JSON] parse login locked flag from redis error: ${e.message}`);
      return;
    }
    rltLoginLockFlag.cnt++;
    rltLoginLockFlag.at = moment().valueOf();
    redis.hset(config.login.redisLockedFlag, userKey, JSON.stringify(rltLoginLockFlag));
    return;
  });
}
/**
 * token登陆
 */
function t_login(uinfo, cb) {
  redis.hget(config.redisKey.LoginInfoMap, `uid_${uinfo.id}`, function (err, token_data) {
    if (err) return cb(err);
    var tokenInfo = {};
    if (token_data) {
      //logger.debug('token_data: ', token_data);
      try {
        tokenInfo = JSON.parse(token_data);
      } catch (e) {
        return cb(e);
      }
    }
    tokenInfo[uinfo.checkInfo.key] = { f: uinfo.checkInfo.value, exp: uinfo.checkInfo.exp };
    //logger.debug('tokenInfo: ', tokenInfo);
    delete uinfo.checkInfo;
    // uinfo.headImgUrl = uinfo.headImgUrl();
    delete uinfo.salt;
    delete uinfo.password;
    redis.hset(config.redisKey.UserInfoMap, `uid_${uinfo.id}`, JSON.stringify(uinfo));
    redis.hset(config.redisKey.LoginInfoMap, `uid_${uinfo.id}`, JSON.stringify(tokenInfo));
    return cb(null);
  });
}