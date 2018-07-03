/**
 * @Author  wqiong
 * @Date    2018-05-21T16:19:39+08:00
 * @Description 帖子页面
 */

const config = require('../../config/config');
let router = require('express').Router();
const mongoose = require("../../config/mongoose");


router.get('/adveditor/test/version', function(req, res, next){
  mongoose.models.User.create({name: "王琼", nickname: "wqiong", username: "顶顶顶顶"}, function(err, doc){
    console.log(doc);
    console.log("222222222")
    return res.json(doc);
  })
  // mongoose.models.User.findById("5b39eb90063f1c33e40caba5").select(["name", "nickname"]).populate({path: "role", select: ["name", "code"]}).exec(function(err, doc){
  //   console.log(doc);
  //   return res.json(doc);
  // })
});

router.get('/adveditor/test/stime', function(req, res, next){
  req.result = sysLibs.response(new Date().getTime());
  return next();
});


module.exports = router;
