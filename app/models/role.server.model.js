/**
 * @Author  wq
 * @Date    2018-04-23T16:44:47+08:00
 * @Description mongoose Schema of user
 */
const Schema = require('mongoose').Schema;

module.exports = new Schema({
    // 角色代码
    code: String,
    // 角色名称
    name: String,
  },
  {
    timestamps: true,
    collection: 'mg_role'
  }
);
