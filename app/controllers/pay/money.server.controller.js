// const nodeMailer = require('nodemailer');
// const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
// const logger = require("../../libs/log4js");

module.exports = {
  /**
   * 发送邮件
  */
  payment: (req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    req.result = sysLibs.response(req.query);
    return next();
  }
};