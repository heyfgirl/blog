/**
 * @Author  Lolo
 * @Date    2018-04-10T09:16:18+08:00
 * @Description express config module
 */

const express = require('express');
const morgan = require('morgan');
// const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');

module.exports = function(){
  console.log('express initialing...');
  const app = express();

  if('development' === process.env.NODE_ENV)
    app.use(morgan('dev'));
  else
    app.use(morgan('combined'));

  // add ejs as template
  app.set('views', __dirname + '/../app/views');
  app.locals.pretty = true;
  app.engine('.html', require('ejs').__express);
  app.set('view engine', 'html');
  // 静态文件
  app.use('/public', express.static('public'));

  app.disable('x-powered-by');

  app.use(bodyParser.urlencoded({
    extended: true
    , limit: '32mb'
  }));
  app.use(bodyParser.json({
    limit: '32mb'
  }));

  app.use(methodOverride());
  app.use(xmlparser());

  //cross access 跨域
  app.use(cors());

  app.use(function(req, res, next){
    req.result = {};
    next();
  });

  // load routes 加载路由==》包括静态文件路径
  require("../config/router")(app);

  // 返回数据
  app.use(function(req, res){
    let result = req.result || res.result;
    if(!result || result.result === undefined){
      // 没有返回值，返回404
      res.status = 404;
      //非API 非Public静态文件 接口 直接跳转到 404页
      if(req.path.indexOf("/api") === -1 && req.path.indexOf("/404.html") === -1){
        return res.redirect("/404.html");
      }
      return res.json({
        result: 'error',
        data: '操作不存在',
        errCode: 404
      });
    }else{
      return res.json(result);
    }
  });
  //捕获全局错误
  app.use(function(err, req, res, next){
    if(!err){
      // ???
      res.status(500);
      return res.json('完全不知道发生了什么...');
    }
    console.log('request 500 err:', err.message, err.stack);
    res.status(500);
    return res.json({
      result: 'error',
      data: err.message,
      errCode: err.code,
    });
  });

  return app;
};
