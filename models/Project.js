const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  projectname: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    default: "#ffffff",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
