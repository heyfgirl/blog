const nodeMailer = require('nodemailer');
const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const redis = require('../../libs/redisSdk').client;
// const async = require('async');

module.exports = {
  loginAuth: (req, res, next) => {
    let username = req.query.username;
    module.exports.sendMail(username)
    .then(data => {
      // console.log(data);
      req.result = data;
      return next();
    });
  },
  /**
   * 发送邮件
  */
  sendMail : (mail) => {
    return new Promise((resolve, reject) => {
      let sid = uuid.v1();
      //redis存储用户登陆密码信息
      redis.hset(config.redisKey.LoginInfoMap, `uid_${mail}`, sid);
      let token = jwt.sign({
        u: mail,
        f: sid
      }, config.JWT_secret, {expiresIn: 60 * 60 });
      let mailTransport = nodeMailer.createTransport({
        host: config.emailConfig.host,
        secure: true,
        auth: {
          user: config.emailConfig.user,
          pass: config.emailConfig.pass
        }
      });
      if(!mail){
        // return next(sysLibs.err(new Error('缺少接收者邮箱参数')));
        return reject(sysLibs.err(new Error('缺少接收者邮箱参数')));
      }
      let options = {
        from: config.emailConfig.user,
        to: mail,
        subject: config.emailConfig.subject,
        text: config.emailConfig.text,
        html: config.emailConfig.emailTemplet('这个邮件是测试标题', mail, token),
      };
      //发送邮件到用户邮箱
      mailTransport.sendMail(options, function(err, msg){
        if(err){
          return reject(sysLibs.err(err));
        }
        sysLibs.logger.debug(JSON.stringify(msg));
        return resolve(sysLibs.response({'mail': mail}));
      });
    });
  },
  /**
   *
   *邮件登陆
   *
   */
  login: (req, res, next) => {
    let token = req.query.f;
    jwt.verify(token, config.JWT_secret, function(err, tokenInfo){
      if(err) return next(sysLibs.err(err));
      if(!tokenInfo) return next(sysLibs.err('token信息不匹配'));
      //获取redis内容数据
      redis.hget(config.redisKey.LoginInfoMap, `uid_${tokenInfo.u}`, function(err, tInfo){
        if(err) return next(sysLibs.err(err));
        if(!tInfo || tokenInfo.f !== tInfo) return next(sysLibs.err('redis内部无token信息不匹配'));
        if(tokenInfo.f === tInfo){
          req.result = sysLibs.response({
            reslut: 'success'
          });
          return next();
        }
      });
    });
  }
};