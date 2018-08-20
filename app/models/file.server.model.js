/**
 * @Author  wq
 * @Date    2018-04-23T16:44:47+08:00
 * @Description mongoose Schema of file
 */
const Schema = require('mongoose').Schema;

module.exports = new Schema({
    // 文件路径
    path: String,
    // 文件名称
    name: String,
    // 文件类型
    type: {
      type: String,
      // default: []
    },
    size: Number
  },
  {
    timestamps: true,
    collection: 'mg_file'
  }
);
