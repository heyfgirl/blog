'use strict';
// const  bodyparser = require('koa-bodyparser')();
// const  koaBody = require('koa-body');



//api
// const apiRoute =function (route) {
//     route.nested("/news/list").post(bodyparser,apiIndex.news.list);     
// }   

// 静态页面
const staticRoute =function (route) {
    route.nested("").all(async (ctx,next)=>{
	console.log("啊啊啊") 
       return await ctx.render("index.html");
    });
}

module.exports = function(app){
    // apiRoute(app.route('/api')); 
    app.route('/').all(async (ctx,next)=>{
    	return await ctx.render("index.html");
    })
    staticRoute(app.route("/index"));

}
