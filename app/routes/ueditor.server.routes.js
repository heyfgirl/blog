/**
 * @Author  wqiong
 * @Date    2018-05-29T11:50:39+08:00
 * @Description 用户登陆注册注销等路由
 */

let router = require('express').Router();

router.get('/api/ueditor/config', /*UserController.auth.loadSession,*/ (req, res) => {
  let config = require("../../public/js/ueditorConfig");
  return res.json(config);
});

module.exports = router;