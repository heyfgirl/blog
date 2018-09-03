
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description 落地页的增删改查模块
 */
const async = require("async");
const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
const pug = require("pug");
const waterline = require("../../../config/waterline");
const fs = require("fs")
const logger = require("../../libs/log4js");

module.exports = {
  /**
   * @api {post} /adveditor/api/landingpage/publish    【发布】
   * @apiName  /landingpage/publish
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data":{
        "result": "success",
        "data": {
            "publishTime": "2018-05-29T10:00:49.593Z"
        },
        "errCode": 200
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
   * errCode :
   *  缺少参数 1001
   *  已经发布过 1002
   *  落地页生成失败 1005
   * 
   * @apiDescription
   * 发布该落地页
   * @apiParam {Boolean} [force] 是否强制更改发布时间
   * @apiParam {String} id  落地页的ID
   * @apiParam {Date} [publishTime] 【可选】发布时间
   */
  publishLandingPage: (req, res, next) => {
    if (!req.body.id) return next(sysLibs.err('缺少参数落地页Id', 1001));
    let publishTime = req.body.publishTime ? new Date(req.body.publishTime) : new Date();
    waterline.models.landingpage
    .findOne()
    .where({ id: req.body.id })
    .exec((err, doc) => {
      if (err) return next(sysLibs.err(err.message, err.code));
      if (!doc) return next(sysLibs.err('该落地页不存在'));
      if (doc.isPublish && doc.publishTime <= new Date() && !req.body.force)
        return next(sysLibs.err('该落地页已经发布，时间为：' + doc.publishTime, 1002));
      else {
        // 将发布状态改为true   改变发布时间
        doc.publishTime = publishTime;
        doc.isPublish = true;
        // 文件
        // let filePath = __dirname+"/../../views/index.pug";
        let filePath = config.viewTemplate.views;
        // let fileSavePath = __dirname+"/../../../public/html/"+doc.id+".html";
        // 
        async.auto({
          //按文件个数生成文件名字
          getCount: function (cb) {
            waterline.models.landingpage
            .find()
            .sort({ 'fileId': 'DESC' })
            .limit(2)
            .exec(function (err, docs) {
              let fileId = (docs[0] || {})['fileId'] || 0;
              fileId++;
              if (err) {
                return cb({message: err.message});
              }
              return cb(null, fileId);
            });
          },
          setFile: ["getCount", function (result, cb) {
            if (err) { return cb(err); }
            if (!doc.fileId && !result.getCount) return cb({message: '获取文件ID失败', code: 1005});
            //存贮文件ID
            doc.fileId = doc.fileId ? doc.fileId : result.getCount;
            // 生成html格式数据
            let htmlTemplateFile;
            try {
              htmlTemplateFile = pug.renderFile(filePath, (doc || {}));
            } catch (err) {
              // console.log(err,1)
            }
            // 生成html数据失败
            if (!htmlTemplateFile){ return cb({message: '生成落地页失败', code: 1005}); }
            delete doc.content.filename;
            // 文件保存地址
            let fileSavePath = config.viewTemplate.saveFolder + doc.fileId + ".html";
            // 写成html文件
            fs.exists(config.viewTemplate.saveFolder, function(exists){
              if(!exists){
                fs.mkdir(config.viewTemplate.saveFolder, function (err) {
                  if(err){
                    return cb({message: err.message});
                  }
                  return saveFile();
                })
              }else{
                return saveFile();
              }
            });
            //文件夹存在则声称文件 函数
            function saveFile(){
              fs.writeFile(fileSavePath, htmlTemplateFile, function (err) {
                if (err) {
                  return cb({message: err.message});
                }
                // 将落地页信息存储在数据库
                doc.linkUrl = doc.fileId + ".html";
                // 将文件存储到cdn服务器，尚未完成
                return cb(null,doc);
              });
            }
          }]
        }, function (err, results) {
          if(err){
            logger.error(`[landingpage] publishAll error: ${err.message}`);
            return sysLibs.err(err.message);
          }
          //保存数据
          doc.save((err) => {
            if (err){ 
              return next(sysLibs.err(err.message, err.code)); 
            }
            req.result = sysLibs.response({
              publishTime: doc.publishTime,
              linkUrl: doc.linkUrl,
              fileId:doc.fileId
            });
            return next();
          })
        });
      }
    });
  },
  /**
   * @api {post} /adveditor/api/landingpage/publishAll    【重新发布全部】
   * @apiName  /landingpage/publishLandinAllgPage
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data":{
        "result": "success",
        "data": {
            "n": 4,
            "publishTime": "2018-05-29T10:00:49.593Z",
            "errIds": []
        },
        "errCode": 200
      }
   * @apiErrorExample 错误示例
      HTTP/1.1 500 Internal Server Error
      "data": {
        result: 'error',
        data: err.message,
        errCode: err.code,
      }
   * errCode :
   *  缺少参数 1001
   *  落地页生成失败 1002
   * 
   * @apiDescription
   * 传入数组则 重新发布数组内所有ID的落地页，否则重新发布所有已发布过的落地页，落地页文件ID不变
   * @apiParam {Array} [ids]  落地页的ID数组
   * @apiParam {Date} [publishTime] 【可选】发布时间
   */
  publishLandinAllgPage: function(req, res, next){
    let publishTime = req.body.publishTime ? new Date(req.body.publishTime) : new Date();
    let ids = req.body.ids || null;
    //时候传有自定义修改的落地页ID，未传入则重新生成全部已被发布的落地页
    let criteria = Array.isArray(ids) ? {id: ids} : {isPublish: true};
    let filePath = config.viewTemplate.views;
    // 先获取需要修改的落地页 再 进行同步修改
    async.auto({
      //按文件个数生成文件名字
      getCount: function (cb) {
        waterline.models.landingpage
        .find(criteria)
        .sort({ 'fileId': 'DESC' })
        .exec(function (err, docs) {
          if (err) {
            return cb({message: err.message});
          }
          let newfileId = (docs[0] || {})['fileId'] || 0;
          let result = {
            fileId: newfileId,
            list: docs || []
          };
          return cb(null, result);
        });
      },
      setFile: ["getCount", function(result, cb){
        let newfileId = result.getCount.fileId;
        let setFileFuns = [];
        // 判断文件夹是否存在
        fs.exists(config.viewTemplate.saveFolder, function(exists){
          if(!exists){
            fs.mkdir(config.viewTemplate.saveFolder, function (err) {
              if(err){
                return cb({message: err.message});
              }
              return saveFile();
            })
          }else{
            return saveFile();
          }
        });
        //文件夹存在则生成文件 函数
        function saveFile(){
          //生成并行promise文件函数
          for(let item of result.getCount.list){
            // console.log(item)
            // 修改发布内容
            if(!item.fileId){
              item.fileId = ++newfileId;
            }
            item.publishTime = publishTime || new Date();
            item.isPublish = true;
            setFileFuns.push(
              new Promise(function(resolve, reject){
                try {
                  //生成模板数据
                  let htmlTemplateFile = pug.renderFile(filePath, (item || {}));
                  //写入模板文件
                  let fileSavePath = config.viewTemplate.saveFolder + item.fileId + ".html";
                  fs.writeFile(fileSavePath, htmlTemplateFile, function (err) {
                    if(err){
                      logger.error(`[landingpage] publishAll error: ${err.message}`);
                      resolve(item.id);
                    }
                    item.linkUrl = item.fileId + ".html";
                    waterline.models.landingpage
                    .update({id: item.id},item)
                    .exec(function(err, doc){
                      if(err){
                        logger.error(`[landingpage] publishAll error: ${err.message}`);
                        resolve(item.id);
                      }
                      if(!doc[0]){
                        logger.error(`[landingpage] publishAll error: 该落地页不存在`);
                        resolve(item.id);
                      }
                      resolve();
                    });
                  });
                } catch (err) {
                  logger.error(`[landingpage] publishAll error: ${err.message}`);
                  resolve(item.id);
                }
              })
            );
          };
          //并行 执行 每个落地页生成函数
          Promise.all(setFileFuns).then(function(result){
            let errIds = result.filter(item => item);
            return cb(null,errIds);
          });
        }
      }]
    },function(err, results){
      if(err){
        logger.error(`[landingpage] publishAll error: ${err.message}`);
        return sysLibs.err(err.message);
      }
      req.result = sysLibs.response({
        n: (results.getCount.list.length - results.setFile.length),
        errIds: results.setFile,
        publishTime: publishTime
      });
      return next();
    });
  },
  /**
   * @api {post} /adveditor/view/landingpage/preview  【预览】
   * @apiName  /landingpage/preview
   * @apiGroup  landingpage
   * @apiVersion 0.0.1
   * @apiSuccessExample 返回示例
      HTTP/1.1 200 OK
      "data":{
        "result": "success",
        "data": {
            
        },
        "errCode": 200
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
   * 发布该落地页
   * @apiParam {String} id 落地页的Id参数
   */
  previewLandingPage: function (req, res, next) {
    let filePath = config.viewTemplate.views;
    if (!req.query.id) errCB('缺少落地页Id参数');
    waterline.models.landingpage
    .findOne()
    .where({ id: req.query.id })
    .exec((err, doc) => {
      if (err) return errCB(err);
      if (!doc) return errCB('不存在该落地页');
      // let content = doc.content || {};
      return res.render(filePath, doc);
    });
    //错误处理
    function errCB(error) {
      return res.json({
        message: '内容不存在',
        errCode: 404
      })
    }
  }
}