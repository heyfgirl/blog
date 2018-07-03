
// ==== model schema declare ======
const User = require("../app/models/user.server.model");
const Role = require("../app/models/role.server.model");
// ================================
module.exports = function(connection){
  connection.models = {};
  connection.models["User"] = connection.model("User", User);
  connection.models["Role"] = connection.model("Role", Role);
  return connection.models;
}

