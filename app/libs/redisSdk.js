/**
 * @Author  wqiong
 * @Date    2018-04-18T15:32:02+08:00
 * @Description redis相关操作
 */

const Redis = require('redis');
const config = require('../../config/config');

let client = Redis.createClient(config.redis_common.redis_port, config.redis_common.redis_host);
if(config.redis_common.redis_pwd) {
  client.auth(config.redis_common.redis_pwd);
}

exports.client = client;
