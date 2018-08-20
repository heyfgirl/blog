/**
 * @Author  wqiong
 * @Date    2018-05-25T10:19:39+08:00
 * @Description 落地页路由模块
 */

let router = require('express').Router();
//上传文件
router.get('/api/upload', /*UserController.auth.loadSession,*/ (req, res) => {
  let config = require("../../public/js/ueditorConfig");
  return res.json(config);
});

module.exports = router;
