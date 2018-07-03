
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description emnu页面渲染服务
 */
module.exports = {
  index: function(req, res){
    if(req.url !== "/"){
      return res.redirect("/");
    }
    new Error("DDDD");
    return res.render(`menu/index.html`);
  },
  about: function(req, res){
    return res.render(`menu/about.html`);
  },
  contact: function(req, res){
    return res.render(`menu/contact.html`);
  }
};