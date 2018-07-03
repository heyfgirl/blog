/**
 * @Author  wqiong
 * @Date    2018-05-21T16:19:39+08:00
 * @Description 错误页面路由
 */

const router = require('express').Router();
const errorController = require("../controllers/error.server.controller");
router.get("/404", errorController.err404);
module.exports = router;