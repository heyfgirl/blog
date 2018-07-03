/**
 * @Author  wqiong
 * @Date    2018-05-21T16:19:39+08:00
 * @Description 网站主页面
 */

const pageController = require('../controllers/page/home.server.controller');
const router = require('express').Router();

//网站主页
router.get("/", pageController.index);
router.get('/page', pageController.index);
router.get('/page/index', pageController.index);
router.get('/page/index.html', pageController.index);
//about页面
router.get('/page/about.html', pageController.about);
//contact页面
router.get('/page/contact.html', pageController.contact);

module.exports = router;