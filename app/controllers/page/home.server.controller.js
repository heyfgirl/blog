
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description emnu页面渲染服务
 */
const mongoose = require("../../../config/mongoose");
const async = require("async");

module.exports = {
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
        .exec(function(err, doc){
          if(err){
            return cb(err);
          }
          return cb(null, doc);
        });
      },
      getLatest: function(cb){
        mongoose.models.Post
        .find()
        .where({type: "latest"})
        .limit(3)
        .sort({createdAt: -1})
        .select({title: 1, time: 1, commentCnt: 1, abstract: 1})
        .exec(function(err, doc){
          if(err){
            return cb(err);
          }
          return cb(null, doc);
        });
      },
      getTestimonial: function(cb){
        let testimonial = [
          {
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`,
            author: 'Adamy Smith',
            authorTitle: 'Doe CEO'
          },
          {
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`,
            author: 'Adamy Smith',
            authorTitle: 'Doe CEO'
          },
          {
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`,
            author: 'Adamy Smith',
            authorTitle: 'Doe CEO'
          }
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
            title: '和氣質哦',
            mood: '大大方方',
            img: 'https://wangqiong.me/public/img/ptf/1.jpg',
            link: '/',
          },
          {
            filter: 'f_stray',
            title: '和氣質哦',
            mood: '大大方方',
            img: 'https://wangqiong.me/public/img/ptf/1.jpg',
            link: '/',
          },
          {
            filter: 'f_city',
            title: '和氣質哦',
            mood: '大大方方',
            img: 'https://wangqiong.me/public/img/ptf/1.jpg',
            link: '/',
          }
        ],
        latest: [
          {
            title: 'Creative Revolution',
            time: 'June 20,',
            comment: '0 Comments',
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
              saepe cupiditate molitia eveniet iste deleniti. . .`,
            id: '123',
            commentId: '123'
          },
          {
            title: 'Creative Revolution',
            time: 'June 20,',
            comment: '0 Comments',
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
              saepe cupiditate molitia eveniet iste deleniti. . .`,
            id: '123',
            commentId: '123'
          },
          {
            id: '123',
            commentId: '123',
            title: 'Creative Revolution',
            time: 'June 20,',
            comment: '0 Comments',
            content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
              saepe cupiditate molitia eveniet iste deleniti. . .`
          },
        ],
        testimonial: results.getTestimonial
      });
    });
  },
  about: function(req, res){
    return res.render(`menu/about.html`,{

    });
  },
  contact: function(req, res){
    return res.render(`menu/contact.html`,{

    });
  }
};