/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description mongoose的models配置模块
 */
// ==== model schema declare ======
const User = require("../../app/models/user.server.model");
const Role = require("../../app/models/role.server.model");
const Post = require("../../app/models/post.server.model");
// ================================
module.exports = function(connection){
  connection.models = {};
  connection.models["User"] = connection.model("User", User);
  connection.models["Role"] = connection.model("Role", Role);
  connection.models["Post"] = connection.model("Post", Post);
  return connection.models;
};

