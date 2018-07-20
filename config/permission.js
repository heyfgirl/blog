'use strict';
/**
 * @Author  wq
 * @Date    2018-04-23T16:44:47+08:00
 * @Description 权限配置文件 不同模块的访问权限 详情
 */
module.exports = {
  // 用户模块
  user: {
    all: {
      code: 'USER_ALL_AUTHORIZATION',
      desc: '用户模块的所有权限',
    },
    read: {
      code: 'USER_READ_AUTHORIZATION',
      desc: '用户模块的可写权限'
    },
    write: {
      code: 'USER_WRITE_AUTHORIZATION',
      desc: '用户模块可写权限'
    }
  }
};