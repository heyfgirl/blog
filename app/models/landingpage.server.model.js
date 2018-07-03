/**
 * @Author  wqiong
 * @Data    2018-05-24T09:44:00+08:00
 * @Description 落地页信息字段对应表model
 */

var Waterline = require("waterline");

module.exports = Waterline.Collection.extend({
  identity: 'landingpage',
  connection: 'mongo',
  // connection: 'mysql',
  schema: true,
  migrate: 'safe',
  attributes: {
    //名称
    name: {
      type: 'string'
    },
    // 创建用户id信息
    createdBy: {
      type: 'string'
    },
    //链接地址  
    linkUrl: 'string',
    //页面浏览量
    pv: {
      type: 'integer',
      defaultsTo: 0
    },
    //获得用户数
    accessUser: {
      type: 'integer',
      defaultsTo: 0
    },
    //落地页内容
    content: {
      type: 'json',
      defaultsTo: {}
    },
    // 是否删除
    isDel: {
      type: 'boolean',
      defaultsTo: false
    },
    // 创建时间
    // createdAt
    // createdTime: 'datetime',
    //最后修改时间
    // updatedAt
    // lastUpdateTime: {
    //   type:'datetime',
    //   defaultsTo:new Date()
    // },
    // 是否为发布状态
    isPublish: {
      type: 'boolean',
      defaultsTo: false
    },
    // 发布时间
    publishTime: {
      type: 'datetime'
    },
    //文件iD 约定为url的文件Id
    fileId: {
      type: 'integer'
    }
  }
});
