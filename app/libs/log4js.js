/**
 * @Author  wqiong
 * @Date    2018-05-21T16:19:39+08:00
 * @Description log4js配置logger
 */

const config = require('../../config/config');
const log4js = require('log4js');
const log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
  path: `${__dirname}/..`,
  format: 'at @name (@file:@line:@column)'
});
log4js.configure(config.logConfigure);
const logger = log4js.getLogger();
let blog_logger = Object.create(logger);

// 日志分类
// blog_logger.blog = log4js.getLogger('blog');
module.exports = blog_logger;
