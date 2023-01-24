const mongoose = require("mongoose");

const UserAppliedSchema = mongoose.Schema({
  name: { type: String, require: true },
  position: { type: String, require: true },
  contract: { type: String, require: true },
  location: { type: String, require: true },
});
const UserAppliedModel = mongoose.model("usersapplied", UserAppliedSchema);
module.exports = UserAppliedModel;
