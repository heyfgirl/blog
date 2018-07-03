/**
 * @2018 copy by crm =>file.server.controller
 * 处理七牛的文件上传
 */
const qiniu = require('qiniu');
const uuid = require('uuid');

const path = require('path');
const url = require('url');
const request = require('request');
const fs = require('fs');
const sysLibs = require('../libs/libs');
var config = require('../../config/config');

// 允许上传的文件类型
const UPLOAD_ALLOWED_FILE_TYPE = require('../../config/config').uploadFileTypes;

// 初始化七牛配置
if (!config.qiniu || !config.qiniu.ak || !config.qiniu.sk || !config.qiniu.bucket) {
  console.log(['配置文件中末定义 Qiniu 的配置，请在在配置中加入：',
    '{',
    '  qiniu: {',
    '    ak:"ACCESS_KEY",',
    '    sk:"SECRET_KEY"',// ak sk 在七牛后台查询（管理首页 => 账号 => 密钥）
    '    bucket:"QINIU_BUCKET_NAME"', // 该值为七牛后台的“空间名字”（管理首页 => “选择一个空间”下拉菜单中）
    '  }',
    '}'].join('\n')
  );
  process.exit();
}
qiniu.conf.ACCESS_KEY = config.qiniu.ak;
qiniu.conf.SECRET_KEY = config.qiniu.sk;
const BUCKET = config.qiniu.bucket;
const BUCKETSECURE = config.qiniu.bucketsecure;

/**
 * 通过存储到七牛的文件名生成上传凭证
 * @param filename string 文件名字
 */
function createUploadKey(filename, ifSecure) {
  var tbucket = ifSecure ? BUCKETSECURE : BUCKET;
  var pp = new qiniu.rs.PutPolicy(tbucket + ':' + filename);
  // pp.callbackUrl = config.qiniu.callbackUrl;
  // pp.callbackBody = 'originName=$(fname)&hash=$(etag)&filename=$(key)';
  return pp.token();
}

/**
 * @api {get} /adveditor/api/file/upload/key 通过存储到七牛的文件名生成上传凭证
 * @apiName qiniu/uploadkey
 * @apiGroup qiniu
 * @apiVersion 0.0.1
 * 
 * @apiParam {String} filename 原文件名
 * @apiParam {String} type     图片用途类别 header
 * @apiSuccessExample 返回示例
    HTTP/1.1 200 OK
    "data":{
      "result":"success",
      "data":{
        "filename": tFilename,
        "token": token
      },
      "errCode":200
    }
 * @apiErrorExample 错误示例
    HTTP/1.1 500 Internal Server Error
      "data":{
      "result":"error",
      "data":err.message,
      "errCode":500
    }
*/
exports.getUploadKey = function (req, res, next) {
  let originName = req.query.filename ? req.query.filename : '';
  let type = req.query.type ? req.query.type : '';
  let ifSecure = (req.query.ifSecure === undefined) ? false : true;

  if (!originName || !type) {
    return next(sysLibs.err("参数不足", 500));
  }
  if (!UPLOAD_ALLOWED_FILE_TYPE[type]) {
    return next(sysLibs.err('图片用途不在允许范围', 500));
  }
  // 检查文件类型
  if (-1 === UPLOAD_ALLOWED_FILE_TYPE[type].indexOf(path.extname(originName).replace('.', ''))) {
    return next(sysLibs.err('不支持上传该类文件', 500));
  }
  let tFilename = uuid.v1() + path.extname(originName);
  try {
    let token = createUploadKey(tFilename, ifSecure);
    req.result = sysLibs.response({
      filename: tFilename,
      token: token
    });
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * @api {post} /adveditor/api/file/upload/callback 通过存储到七牛的文件名生成上传凭证
 * @apiName qiniu/callback
 * @apiGroup qiniu
 * @apiVersion 0.0.1
 * @apiDescription
 * 七牛云接口非API使用
 * 本接口处理客户端文件上传完成后，七牛所发送的回调，具体请参见
 * http://developer.qiniu.com/article/kodo/kodo-developer/up/response-types.html#callback
 */
exports.qiniuCallback = function (req, res, next) {
  if (!req.body.filename) {
    return next(sysLibs.err('params error', 500));
  }
  // authorization: 'QBox u2N9m31MwQZfrEFnCBoETGAtl3NEWA1hhMOJkK9_:JIGCWeVZNb1RuV71b8YQMBWw8cQ='
  var isAuthorizationError = false;
  // check qiniu authorization
  if (!req.headers.authorization) {
    isAuthorizationError = true;
  }
  if (0 !== req.headers.authorization.search('QBox ')) {
    isAuthorizationError = true;
  }
  var spt = req.headers.authorization.replace('QBox ', '').split(':');
  if (!Array.isArray(spt) || 2 !== spt.length) {
    isAuthorizationError = true;
  }
  // check access token
  if (spt[0] !== config.qiniu.ak) {
    isAuthorizationError = true;
  }
  // @todo check encoded_data in authorization 
  // http://developer.qiniu.com/article/kodo/kodo-developer/up/response-types.html
  if (isAuthorizationError) {
    return next(sysLibs.err('authorization error', 500));
  }

  req.result = sysLibs.response({
    filename: req.body.filename,
    isUpload: true
  });
  return next();
}