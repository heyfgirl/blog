const sysLibs = require('../../libs/libs');
const multiparty = require('multiparty');
const Ueditor = require("../../../config/ueditor");
const moment = require("moment");
const config = require("../../../config/config");
const fs = require("fs");
const mongoose = require("../../../config/mongoose");
const async = require("async");
const uuid = require('uuid');
const path = require("path");

module.exports = {
  /**
   * @api {get} /adveditor/api/file/upload/key 通过存储到七牛的文件名生成上传凭证
   * @apiName qiniu/uploadkey
   * @apiGroup qiniu
   * @apiVersion 0.0.1
   *
   * @apiParam {String} filename 原文件名
   * @apiParam {String} type     图片用途类别 header
   * @apiSuccessExample 返回示例
  */
  getConfig : (req, res) => {
    let config = require("../../../config/ueditor");
    // req.result = sysLibs.response(config);
    return res.json(config);
  },
  /**
   * @api {get} /adveditor/api/file/upload/key 通过存储到七牛的文件名生成上传凭证
   * @apiName qiniu/uploadkey
   * @apiGroup qiniu
   * @apiVersion 0.0.1
   */
  uploadImg: (req, res, next) => {
    if(req.query.action === 'uploadimage'){
      return module.exports.uploadImage(req, res, next);
    }
    if(req.query.action === 'uploadscrawl'){
      return module.exports.uploadScrawl(req, res, next);
    }

    return next(new Error('缺少参数action'));
  },
  //上传图片
  uploadImage: (req, res, next) =>{
    var form = new multiparty.Form();
    form.uploadDir = Ueditor.imageCache;
    form.parse(req, function(err, fields, files) {
      // console.log(files);
      if(err){
        return next(sysLibs.err(err.message));
      }
      if(!files || !files['upfile']){
        return next(sysLibs.err('传入文件失败'));
      }
      let fileSavePath = `${config.uploadFile.path}${moment().format('YYYY_MM_DD')}/`;
      let options = {};
      options.name = files['upfile'][0]['originalFilename'];
      options.path = `${fileSavePath}${uuid.v1()}${path.extname(options.name)}`;
      options.size = files['upfile'][0]['size'];
      options.type = files['upfile'][0]['headers']['content-type'];
      async.auto({
        //判断文件夹时候存在
        exists: function(cb){
          return cb(null, fs.existsSync(fileSavePath));
        },
        //创建文件夹
        create: ['exists', function(result, cb){
          if(!result.exists){
            fs.mkdir(fileSavePath, function(err){
              if(err){
                return cb(new Error('创建文件夹失败'));
              }
              return cb();
            });
          }else{
            return cb();
          }
        }]
      }, function(err){
        if(err){
          return next(sysLibs.err(err.message));
        }
        //移动缓存文件到存储文件夹
        fs.rename(files['upfile'][0]['path'], options.path, function(err){
          // console.log(err);
          if(err){
            return next(sysLibs.err(err.message));
          }
          mongoose.models.File
          .create(options, function(err, doc){
            // console.log(doc);
            if(err){
              return next(sysLibs.err(err.message));
            }
            process.nextTick(function(){
              return res.json({
                "state": "SUCCESS",
                "url": doc.path,
                "title": doc.name,
                "original": doc.name
              });
            });
          });
        });
      });
    });
  },
  //上传手画
  uploadScrawl: (req, res, next) => {
    let baseImg = req.body.upfile;
    let imgName = uuid.v1() + '.jpg';
    var base64Data = baseImg.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    let fileSavePath = `${config.uploadFile.path}${moment().format('YYYY_MM_DD')}/${imgName}`;
    fs.writeFile(fileSavePath, dataBuffer, function(err) {
      if(err){
        return next(sysLibs.err(err.message));
      }
      process.nextTick(function(){
        return res.json({
          "state": "SUCCESS",
          "url": fileSavePath,
          "title": imgName,
          "original": imgName
        });
      });
    });
  }
};