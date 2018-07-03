/**
 * @Author  wqiong
 * @Date    2018-05-21T16:19:39+08:00
 * @Description 网站主页面
 */

const config = require('../../config/config');
let router = require('express').Router();

//网站主页
router.get("/", function (req, res, next) {
	return res.render(`menu/index.html`);
})
router.get('/page/index.html', function (req, res, next) {
	return res.redirect("/");
});
//about页面
router.get('/page/about.html', function (req, res, next) {
	return res.render(`menu/about.html`);
});
//contact页面
router.get('/page/contact.html', function (req, res, next) {
	return res.render(`menu/contact.html`);
});

module.exports = router;