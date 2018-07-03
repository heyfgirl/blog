/**
 * @Author  wqiong
 * @Date    2018-05-30T15:39:18+08:00
 * @Description 用户token验证相关中间件
 */

const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
const moment = require('moment');
var jwt = require('jsonwebtoken');
const redis = require('../../libs/redisSdk').client;
const logger = require("../../libs/log4js");
var waterline = require('../../../config/waterline');

module.exports = {
  /**
   * 用户token验证中间件
   */
  loadSession: function(req, res, next){
    var token = req.headers.f;
    var vsf = req.headers.vsf ? req.headers.vsf : 'web';
    req.vsf = vsf;
    
    /**
     * req.body参数中，传入空字串的参数预处理
     */
    if(req.body){
      Object.keys(req.body).forEach(function(key){
        if(req.body[key] === '') delete req.body[key];
      });
    }
    
    //logger.info('token: ', req.headers.f);
    //logger.info('vsf: ', req.headers.vsf);

    if(!token) return next(sysLibs.err('参数不足，缺少验证信息',500));
    //验证token
    jwt.verify(token, config.JWT_secret, function(err, decoded){
      //logger.debug(err, decoded);
      if(err) return next(sysLibs.err('会话验证失败',500));
      if(decoded.vsf !== vsf) return next(sysLibs.err('登录平台与授权码不一致',500));

      var t_exp = parseInt(moment().startOf('day').valueOf() / 1000);
      if(decoded.exp<t_exp) return next(sysLibs.err('会话信息已过期,请重新登陆',500));

      redis.hget(config.redisKey.landingPageLoginInfoMap, `uid_${decoded.uid}`, function(err, loginInfo){
        if(err) return next(sysLibs.err((err.message||err),(err.code||500)));
        if(!loginInfo) return next(sysLibs.err('用户未登录',500));
        try{
          loginInfo = JSON.parse(loginInfo);
        }catch(e){
          return next(e);
        }

        // 判断用户在该平台上是否已经登录
        if(!loginInfo[vsf] || loginInfo[vsf].f !== decoded.f){
          return next(sysLibs.err('用户未登录',500));
        }

        module.exports.loadUserInfo(decoded.uid, function(err, uinfo){
          if(err) return next(sysLibs.err((err.message||err),(err.code||500)));
          logger.debug(`[uid]:${uinfo.id} # connect authenticate success.`);
          req.userInfo = uinfo;
          return next();
        });
      });
    });
  },

  /**
   * 获取用户信息
   * 1. redis中有，直接返回
   * 2. redis中没有，查询数据库，返回数据并设置redis数据
   */
  loadUserInfo: function(uid, cb){
    redis.hget(config.redisKey.landingPageUserInfoMap, `uid_${uid}`, function(err, rlt_userinfo){
      if(err) return cb(err);
      if(rlt_userinfo){
        // redis中存在用户数据，返回
        try{
          rlt_userinfo = JSON.parse(rlt_userinfo);
        }catch(e){
          return cb(e);
        }
        return cb(null, rlt_userinfo);
      }else{
        // 不存在redis缓存数据，需要从数据库中加载
        cb('会话信息已过期,请重新登陆');
      }
    });
  }
};
