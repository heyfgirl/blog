/**
 * 测试用数据库model
 */

var Waterline = require("waterline");

module.exports = Waterline.Collection.extend({
  identity: 'post',
  connection: 'mongo',
  // connection: 'mysql',
  schema: true,
  migrate: 'safe',
  attributes: {
    //名称
    name: {
      type: 'string'
    },
    gender: 'string'
  }
});
