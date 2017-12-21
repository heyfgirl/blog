'use strict'
const koa =require('koa');
const App = new koa();
const Static = require('koa-static');
const Views = require('koa-views');
const router = require('koa2-routing');
const routers = require('./routes');

//加载全局错误
App.use(async (ctx, next) => {
    try{
        console.log("进入网站首页控制器");
        // console.log(ctx.request)
        await next();
    }catch(err){
        console.log(err);
        ctx.status =500;
        // await ctx.render("error.jade",err);
    }
});
//加载静态目录
App.use(Static(__dirname + '/public'));
//加载视图文件夹
App.use(Views('views', {
    root: __dirname + '/views',
    default: 'hbs',
    map: { hbs: 'handlebars',html: 'underscore' }
}));

//加载路由
App.use(router(App));
routers(App);

App.port = "80";

if(module.parent){
    //如果由根目录的app.js 启动
    module.exports = App;
    console.log("根目录启动listen in port")
}else{
    //如果独立启动
    App.listen(App.port);
    console.log("独立启动listen in port :"+App.port )
}
