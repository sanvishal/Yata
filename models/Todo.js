const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  task: {
    type: String,
    required: true,
  },
  projects: [
    {
      _id: false,
      projectname: {
        type: String,
      },
      projectid: {
        type: Schema.Types.ObjectId,
        ref: "projects",
      },
    },
  ],
  creation_date: {
    type: Date,
    default: Date.now,
  },
  done_date: {
    type: Date,
    default: "",
  },
  status: {
    type: Number,
    default: 0,
  },
  done: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: "",
  },
  deadline: {
    type: Date,
    default: "",
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

// 0 - yet to do
// 1 - doing
// 2 - did/done

module.exports = Todo = mongoose.model("todo", TodoSchema);
