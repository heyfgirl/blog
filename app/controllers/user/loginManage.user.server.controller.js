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
const commonFunction = require('../../utils/commonFunction');
const sysLibs = require('../../libs/libs');
const async = require("async");
const request = require('request');
const mongoose = require("../../../config/mongoose");

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
    async.auto({
      //获取登录token
      getCrmToken: function (cb) {
        //登陆crm 接口http配置
        let crm_login_options = {
          url: config.login.url + 'gm/user/login',
          method: 'POST',
          headers: {
            vsf: vsf,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          params: {
            password: req.body.password,
            user: req.body.user,
            vsf: vsf
          }
        };
        requestData(crm_login_options, (err, rlt_user_login_token) => {
          if (err) return cb(err);
          if (!rlt_user_login_token || !rlt_user_login_token.data || !rlt_user_login_token.data.token) return cb('用户不存在');
          console.log();
          // 通过token获取用户信息
          let options = {
            token: rlt_user_login_token.data.token,
            vsf: vsf
          };
          return cb(null, options);
        });
      },
      //通过token获取用户信息
      getUserInfo: ['getCrmToken', function (result, cb) {
        //获取信息 接口http配置
        let crm_token_user_options = {
          url: config.login.url + 'gm/user/userInfo',
          // url: 'http://crm.czbapp.com/gm/user/userInfo',
          method: 'get',
          headers: {
            f: result.getCrmToken.token,
            vsf: vsf
          }
        };
        requestData(crm_token_user_options, (err, rlt_user_info) => {
          if (err) return cb(err);
          if (!rlt_user_info || !rlt_user_info.data || !rlt_user_info.data.username || rlt_user_info.code != 200) return cb('token获取信息失败');
          let rlt_user_login = rlt_user_info.data;
          if (rlt_user_login.isSuspend) return cb('用户被冻结');

          if (rlt_user_login.type.length === 0) {
            // sysLog('user', 'login', '[post]/gm/user/login', rlt_user_login.username, '用户类型错误，无法登录');
            return cb('用户类型错误，无法登录');
          }
          if (rlt_user_login.type.indexOf('admin') !== -1 && !rlt_user_login.adminId) {
            // sysLog('user', 'login', '[post]/gm/user/login', rlt_user_login.username, '查询不到管理员用户信息，无法登录');
            return cb('查询不到管理员用户信息，无法登录');
          }
          if (rlt_user_login.type.indexOf('admin') === -1 && rlt_user_login.adminId) {
            // 不是管理员角色类型，有管理员用户信息，不给出来
            delete rlt_user_login.adminId;
          }
          if (rlt_user_login.type.indexOf('employee') !== -1 && !rlt_user_login.employeeId) {
            // sysLog('user', 'login', '[post]/gm/user/login', rlt_user_login.username, '查询不到业务人员用户信息，无法登录');
            return cb('查询不到业务人员用户信息，无法登录');
          }
          if (rlt_user_login.type.indexOf('employee') === -1 && rlt_user_login.employeeId) {
            // 不是管理员角色类型，有管理员用户信息，不给出来
            delete rlt_user_login.employeeId;
          }
          // 设置过期时间到今天结束
          var t_exp = parseInt(moment().startOf('day').add(1, 'day').valueOf() / 1000);
          var uinfo = { uid: rlt_user_login.id, f: uuid.v1(), exp: t_exp, vsf: vsf };
          var localToken = jwt.sign(uinfo, config.JWT_secret);
          rlt_user_login.checkInfo = { key: vsf, value: uinfo.f, exp: uinfo.exp };
          return cb(null, { token: localToken, userInfo: rlt_user_login });
        });
      }]
    }, function (err, result) {
      //更改redis中用户信息
      if (err) {
        updateRedisLockFlag(req.body.user);
        return next(sysLibs.err(err.message));
      }
      //token登陆设置redis
      t_login(result.getUserInfo.userInfo, function (err) {
        if (err) return next(sysLibs.err(err.message));
        req.userInfo = result.getUserInfo.userInfo;
        updateRedisLockFlag(req.body.user, true);
        //返回token和用户信息
        req.result = sysLibs.response(result.getUserInfo);
        return next();
      });
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
    req.result = sysLibs.response({
      id: req.userInfo.id,
      username: req.userInfo.username,
      nickname: req.userInfo.nickname,
      headImg: req.userInfo.headImg,
      headImgUrl: req.userInfo.headImgUrl,
      mobi: req.userInfo.mobi,
      type: req.userInfo.type,
      employeeId: req.userInfo.employeeId,
      adminId: req.userInfo.adminId,
      createdAt: req.userInfo.createdAt,
      createdBy: req.userInfo.createdBy
    });
    return next();
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
    return next();
    // logger.warn('TOUCH HERE (checkLoginLog)');
    if (!req.body.user) return next(sysLibs.err('没有提供用户登录名或者手机号信息'));
    if (!req.body.password) return next(sysLibs.err('没有提供密码信息'));
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
    redis.hset(config.redisKey.UserInfoMap, `uid_${uinfo.id}`, JSON.stringify(uinfo));
    redis.hset(config.redisKey.LoginInfoMap, `uid_${uinfo.id}`, JSON.stringify(tokenInfo));
    return cb(null);
  });
}