
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description emnu页面渲染服务
 */
const mongoose = require("../../../config/mongoose");
const async = require("async");

module.exports = {
  /**
   * 首页
   */
  index: function(req, res){
    if(req.url !== "/"){
      return res.redirect("/");
    }
    async.auto({
      getPortfolio: function(cb){
        mongoose.models.Post
        .find()
        .where({type: "portfolio"})
        .limit(9)
        .sort({createdAt: -1})
        .select({title: 1, filter: 1, mood: 1, image: 1, _id: 1})
        .exec(function(err, docs){
          if(err){
            return cb(err);
          }
          return cb(null, docs);
        });
      },
      getLatest: function(cb){
        mongoose.models.Post
        .find()
        .where({type: "latest"})
        .limit(3)
        .sort({createdAt: -1})
        .select({title: 1, time: 1, commentCnt: 1, abstract: 1})
        .exec(function(err, docs){
          if(err){
            return cb(err);
          }
          return cb(null, docs);
        });
      },
      getTestimonial: function(cb){
        let testimonial = [
          {
            content: `我是个蒸不烂、煮不熟、捶不匾、炒不爆、
            响珰珰一粒铜豌豆！`,
            author: '关汉卿',
            authorTitle: '已斋'
          },
        ];
        return cb(null, testimonial);
      }
    }, function(err, results){
      if(err){
        return res.redirect("/404.html");
      }
      return res.render(`menu/index.html`,{
        portfolio: [
          {
            filter: 'f_stray',
            title: '梦里花落知多少',
            mood: '来来去去',
            img: 'https://wangqiong.me/public/img/ptf/1.jpg',
            link: '/',
          },
        ],
        latest: [
          {
            title: `c'est la vie！`,
            time: 'June 20,',
            comment: '0 Comments',
            content: `Danger itself the best remedy of danger. . .`,
            id: '123',
            commentId: '123'
          },
        ],
        testimonial: results.getTestimonial
      });
    });
  },
  /**
   * 关于页面
   */
  about: function(req, res){
    return res.render(`menu/about.html`,{
      
    });
  },
  /**
   * 联系页面
   */
  contact: function(req, res){
    return res.render(`menu/contact.html`,{

    });
  }
};