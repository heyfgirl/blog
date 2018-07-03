module.exports = {
  err404: function(req, res){
    // return res.redirect("/");
    return res.render("menu/index.html");
  }
};