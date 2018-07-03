/**
 * @Author  Lolo
 * @Date    2018-04-09T18:08:24+08:00
 * @Description libs导出接口文件
 */

const logger = require('./log4js');
const genResult = require('./gen.result');

module.exports = {
  logger: logger,
  response: genResult.response,
  err: genResult.err,
};
