
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description 落地页的增删改查模块
 */
const async = require("async");
const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
const waterline = require("../../../config/waterline");
const logger = require("../../libs/log4js");
const request = require("request");
const commonFunction = require('../../utils/commonFunction');

module.exports = {
  /**
   * @api {post} /adveditor/api/landingpage/add  【新增加】
   * @apiName 【新增加】
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiParam {String} name  落地页名称
   * @apiParam {String} [linkUrl] 链接地址
   * @apiParam {Json} [content]  落地页内容
   * 
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
        result: 'success',
        data: {
          name:'wqiong',
          createdBy:'123456'
        },
        errCode: code,
      }
      errCode: 
        '0': '用户添加成功'
        '500': '系统错误，请联系管理员'
        '1001': '缺少认证参数'
        '1002': '权限认证失败'
        '1003': '必要参数缺失'
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
   * 
   * @apiDescription
   * 新增落地页
   */
  addLandingPage: (req, res, next) => {
    if (!req.body.name) {
      return next(sysLibs.err('没有提供落地页名称参数', 1003));
    }
    // if(!req.body.createdBy) return next(sysLibs.err('没有提供创建者Id参数',500));
    let attributes = ["name", "linkUrl", "content"];
    let newData = {};
    for (let key in req.body) {
      if (attributes.indexOf(key) != -1) {
        newData[key] = req.body[key];
      }
    }
    newData['createdBy'] = req.userInfo.id;
    waterline.models.landingpage
    .create(newData)
    .exec((err, adveditor) => {
      if (err) {
        return next(sysLibs.err(err.message));
      }

      req.result = sysLibs.response(adveditor);
      return next();
    })
  },
  /**
   * @api {post} /adveditor/api/landingpage/del 【删除】
   * @apiName  /landingpage/del
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
     HTTP/1.1 200 OK
     "data": {
      "result": "success",
      "data":{
      "id": "5b066ae88108e525a91f8646"
     },
     "code":200
    }
   * @apiErrorExample 错误示例
     HTTP/1.1 500 Internal Server Error
     "data": {
      result: 'error',
      data: err.message,
      errCode: err.code,
     }
   * 
   * @apiDescription
   * 假删落地页
   * 
   * @apiParam {String} id  落地页Id
  */
  delLandingPage: (req, res, next) => {
    if (!req.body.id) return next(sysLibs.err('没有提供用落地页Id参数', 1001));
    waterline.models.landingpage
    // 查询该落地页是否存在
    .findOne()
    .where({ id: req.body.id })
    .exec((err, doc) => {
      //获取各种错误信息
      let errInfo;
      if (err) errInfo = err;
      if (!doc || doc['isDel'] === true) errInfo = sysLibs.err('该落地页不存在,或已被删除', 500);
      // if()errInfo = sysLibs.err('该落地页已是被删除数据',500);
      //回调
      if (errInfo) {
        return next(errInfo);
      } else {
        doc.isDel = true;
        //将该落地页改为被删除状态
        doc.save((err) => {
          if (err) return next(sysLibs.err(err.message, err.code));
          else {
            req.result = sysLibs.response({ id: doc.id });
            return next();
          }
        });
      }
    })
  },
  /**
   * @api {post} /adveditor/api/landingpage/info 【获取信息】
   * @apiName  /landingpage/info
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
        "result": "success",
        "data":{
          "name": "这个落地页",
          "createdBy": "1234324",
          "linkUrl": "wangqiong.me",
        },
        "code":200
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
   * @apiDescription
   * 获取落地页详细信息
   * 
   * @apiParam {String} id  落地页Id
   */
  infoLandingPage: (req, res, next) => {
    if (!req.body.id) return next(sysLibs.err('未提供落地页Id信息', 500));
    waterline.models.landingpage
    .findOne()
    .where({ id: req.body.id, isDel: { '!': true } })
    .exec((err, pageInfo) => {
      if (err) return next(sysLibs.err(err.message, err.code));
      if (!pageInfo) return next(sysLibs.err('该落地页不存在', 500));

      let options = {
        url: "http://elasticsearch.inner.czbapp.com:8121/LandingPage/statistics",
        method: 'get',
      }
      request(options, function(err, response, body){
        if(err){
          logger.error(`pv_r get err : ${err.message}`);
          return next(sysLibs.err(err.message));
        }
        // logger.info('pv_r: ', body);
        // logger.info(`id: ${pageInfo}`);
        delete pageInfo.pv;
        try{
          body = typeof body === 'string' ? JSON.parse(body) : body;
        }catch(err){
          logger.error('pv_r.result : not isArry'+err);
        }
        if(Array.isArray(body.result)){
          // logger.info('pv_r.result : isArry');
          // logger.info(`id: ${pageInfo.id}`);
          for(let item of body.result){
            if(item.id == pageInfo.id){
              pageInfo.pv = item.pv;
              pageInfo.registry = item.registry;
              break;
            }
          }
        }
        req.result = sysLibs.response(pageInfo);
        return next();
      });
    })
  },
  /**
   * @api {post} /adveditor/api/landingpage/update 【更新】
   * @apiName  /landingpage/update
   * @apiGroup landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data": {
        "result": "success",
        "data":{
          "name": "这个落地页",
          "createdBy": "1234324",
          "linkUrl": "wangqiong.me",
        },
        "code":200
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
   * 
   * @apiDescription
   * 修改落地页内容
   * 
   * @apiParam {String} id  落地页Id
   * @apiParam {String} [name]  落地页名字
   * @apiParam {String} [linkUrl]  落地页链接地址
   * @apiParam {Json} [content]  落地页内容
   */
  updateLandingPage: (req, res, next) => {
    if (!req.body.id) return next(sysLibs.err('未提供落地页Id参数', 500));
    // 查询该落地页是否存在
    waterline.models.landingpage
    .findOne()
    .where({ id: req.body.id, isDel: { '!': true } })
    .exec((err, pageInfo) => {
      if (err) return next(sysLibs.err(err.message, err.code));
      if (!pageInfo) return next(sysLibs.err('该落地页不存在', 500));

      let options = req.body;
      // 将获取的参数信息格式化
      for (let key in options) {
        if (key == 'name' || key == 'linkUrl') pageInfo[key] = options[key];
        if (key == 'content') {
          pageInfo[key] = pageInfo[key] || {};
          for (let i in options[key]) {
            pageInfo[key][i] = options[key][i];
          }
        }
      }
      // 修改落地页信息
      pageInfo.save(err => {
        if (err) return next(sysLibs.err(err.message, err.code));
        req.result = sysLibs.response(pageInfo);
        return next();
      })
    });
  },
  /**
 * @api {post} /adveditor/api/landingpage/list  【列表】
 * @apiName  /landingpage/list
 * @apiGroup  landingpage
 * @apiVersion 0.0.1
 * @apiSuccessExample 返回示例
    HTTP/1.1 200 OK
    "data":{
      result: 'success',
      data:{
        count:3,
        data:[
        {name:''},
        {name:''},
        {name:''}
        ]
      },
      code:200
    }
 * @apiErrorExample 错误示例
    HTTP/1.1 500 Internal Server Error
    "data": {
      result: 'error',
      data: err.message,
      errCode: err.code,
    }
 * 
 * @apiDescription
 * 获取落地页列表list信息
 * 
 * @apiParam {String} [keyword] 筛选关键字，可以比name
 * @apiParam {Boolean} [isPublish]  落地页是否已发布
 * @apiParam {Number} [pagesize] 分页参数
 * @apiParam {Number} [pagestart] 分页参数
 * @apiParam {Date}   [publishTime.gt]  发布时间下限
 * @apiParam {Date}   [publishTime.lt]  发布时间上限
 */
  listLandingPage: (req, res, next) => {
    let cond = { isDel: false };
    //排序
    let sort = {};
    let isPublish = req.body.isPublish;//是否发布
    if (isPublish) {
      cond["isPublish"] = true;
      cond["publishTime"] = { '<=': new Date() };
      sort = { publishTime: 'DESC' };
    } else {
      cond["isPublish"] = false;
      sort = { updatedAt: 'DESC' };
    }
    //查询条件
    let keyword = req.body.keyword;
    if (keyword) {
      cond.or = [
        { name: { like: "%" + keyword + "%" } },
      ];
    }
    try {
      if ((req.body.publishTime || {}).gt) cond['publishTime']['>='] = new Date(req.body.publishTime.gt);
      if ((req.body.publishTime || {}).lt) cond['publishTime']['<='] = new Date(req.body.publishTime.lt);
    } catch (err) {
      // 时间格式错误
      return next(sysLibs.err('时间格式错误', 500));
    }
    // 分页相关
    let pagestart = parseInt(req.body.pagestart, 10) || 1;
    let pagesize = parseInt(req.body.pagesize, 10) || 10;
    async.auto({
      getCount: function (cb) {
        waterline.models.landingpage
        .count()
        .where(cond)
        .exec((err, total) => {
          if (err) return cb(err);
          return cb(null, total);
        });
      },
      getList: function (cb) {
        waterline.models.landingpage
        .find()
        .sort(sort)
        .where(cond)
        .paginate({ page: pagestart, limit: pagesize })
        // .skip((pagestart-1)*pagesize)
        // .limit(pagesize)
        .exec((err, docs) => {
          if (err) return cb(err);
          return cb(null, docs);
        });
      }
    }, function (err, result) {
      if (err) return next(sysLibs.err(err.message, err.code));
      let options = {
        url: "http://elasticsearch.inner.czbapp.com:8121/LandingPage/statistics",
        method: 'get',
      }
      request(options, function(err, response, body){
        if(err){
          // logger.error(`pv_r get err : ${err.message}`);
          return next(sysLibs.err(err.message));
        }
        // logger.info('pv_r: ', body);

        try{
          body = typeof body === 'string' ? JSON.parse(body) : body;
        }catch(err){
          logger.error('pv_r.result : not isArry'+err);
        }
        let newList = [];
        if(body&&Array.isArray(body.result)){
          // logger.info('pv_r.body: ', body.result);
          for(let item of result.getList){
            delete item.pv;
            for(let pv_r of body.result){
              if(item.id == pv_r.id){
                item.pv = pv_r.pv;
                item.registry = pv_r.registry;
                break;
              }
            }
            newList.push(item);
          }
        }
        let data = {
          count: (result.getCount || 0),
          data: (newList || [])
        }
        req.result = sysLibs.response(data);
        return next();
      });
    })
  },
};