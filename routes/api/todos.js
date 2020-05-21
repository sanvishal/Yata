const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const isEmpty = require("is-empty");
const ObjectId = require("mongoose").Types.ObjectId;

const Project = require("../../models/Project");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

const router = express.Router();

// router.use(function (req, res, next) {
//     var token = req.headers["x-access-token"].split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         type: "auth",
//         message: "You are not authorized to access",
//         status: "error",
//       });
//     }
//     jwt.verify(token, keys.serverSecret, function (err, decoded) {
//       if (err) {
//         return res.status(401).json({
//           type: "auth",
//           message: "You are not authorized to access",
//           status: "error",
//         });
//       } else {
//         //console.log("approved", decoded);
//         next();
//       }
//     });
//   });

router.post("/addtodo", (req, res) => {
  const { id, task, projects, status, notes, deadline } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "You are not authorised",
      type: "auth",
    });
  } else if (task.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Enter a valid task",
      type: "todo",
    });
  } else {
    User.findOne({ _id: id }).then((user) => {
      if (!user) {
        return res.status(401).json({
          type: "auth",
          message: "You are not authorized to access",
          status: "error",
        });
      } else {
        if (status === 0 || status === 1 || status === 2) {
          let todoData = {
            userid: id,
            task,
            status,
            projects,
            deadline,
          };
          if (status === 2) {
            todoData = {
              ...todoData,
              done: true,
              done_date: Date.now(),
              notes,
            };
          }
          let newTodo = new Todo(todoData);
          newTodo.save().then((todo) => {
            return res.json({
              status: "success",
              message: todo,
              type: "todo",
            });
          });
        } else {
          return res.status(400).json({
            status: "error",
            message: "malformed request :(",
            type: "todo",
          });
        }
      }
    });
  }
});

module.exports = router;
