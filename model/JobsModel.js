const mongoose = require("mongoose");

const JobsSchema = mongoose.Schema({
  name: { type: String, require: true },
  position: { type: String, require: true },
  contract: { type: String, enum: ["fulltime", "parttime"], require: true },
  location: { type: String, require: true },
});
const JobsModel = mongoose.model("jobs", JobsSchema);
module.exports = JobsModel;
