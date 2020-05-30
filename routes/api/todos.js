const express = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const keys = require("../../config/keys");
const isEmpty = require("is-empty");
const ObjectId = require("mongoose").Types.ObjectId;

const Project = require("../../models/Project");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

const router = express.Router();

// router.use(function (req, res, next) {
//   var token = req.headers["x-access-token"].split(" ")[1];
//   if (!token) {
//     return res.status(401).json({
//       type: "auth",
//       message: "You are not authorized to access",
//       status: "error",
//     });
//   }
//   jwt.verify(token, keys.serverSecret, function (err, decoded) {
//     if (err) {
//       return res.status(401).json({
//         type: "auth",
//         message: "You are not authorized to access",
//         status: "error",
//       });
//     } else {
//       //console.log("approved", decoded);
//       next();
//     }
//   });
// });

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

router.use("/gettodos", (req, res) => {
  const { id, projectid } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "You are not authorised",
      type: "auth",
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
        if (ObjectId.isValid(projectid)) {
          Todo.find({
            userid: id,
            projects: { $elemMatch: { projectid: projectid } },
          })
            .then((todos) => {
              return res.json({
                status: "success",
                message: todos,
                type: "todo",
              });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "error",
                message: "Internel server error",
                type: "todo",
              });
            });
        } else {
          Todo.find({
            userid: id,
          })
            .then((todos) => {
              return res.json({
                status: "success",
                message: todos,
                type: "todo",
              });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "error",
                message: "Internel server error",
                type: "todo",
              });
            });
        }
      }
    });
  }
});

router.post("/setstatus", (req, res) => {
  const { id } = req.body;
  let status = parseInt(req.body.status);

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "You are not authorised",
      type: "auth",
    });
  } else if (status !== 0 && status !== 1 && status !== 2) {
    return res.status(400).json({
      status: "error",
      message: "Malformed request",
      type: "todo",
    });
  } else {
    if (status === 2) {
      Todo.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            done: true,
            done_date: Date.now(),
            status,
          },
        },
        { new: true }
      )
        .then((result) => {
          // let projectids = [];
          // result.projects.forEach((project) => {
          //   projectids.push(project.projectid);
          // });
          // Todo.aggregate([
          //   {
          //     $match: {
          //       done: true,
          //       projects: { $elemMatch: { projectid: { $in: projectids } } },
          //     },
          //   },
          //   { $unwind: "$projects" },
          //   {
          //     $group: {
          //       _id: "$projects.projectid",
          //       done: { $first: "$done" },
          //     },
          //   },
          // ]).then((agg) => {
          //   console.log(agg);
          // });

          res.json({
            status: "success",
            type: "todo",
            message: result,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            status: "error",
            message: "Internel server error",
            type: "todo",
          });
        });
    } else {
      Todo.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            status,
            done: false,
            done_date: null,
          },
        },
        { new: true }
      )
        .then((result) => {
          res.json({
            status: "success",
            type: "todo",
            message: result,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            status: "error",
            message: "Internel server error",
            type: "todo",
          });
        });
    }
  }
});

router.post("/gettodosbydate", (req, res) => {
  const { id, date } = req.body;

  let start = moment(date).startOf("day").toISOString();
  let end = moment(date).endOf("day").toISOString();
  // console.log(start, end);
  // let dateObj = new Date(date),
  //   lte = new Date(
  //     dateObj.getFullYear(),
  //     dateObj.getMonth(),
  //     dateObj.getDate()
  //   );
  // lte.setUTCHours(0, 0, 0, 0);
  // let gte = new Date(lte);
  // gte.setDate(gte.getDate() + 1);

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "You are not authorised",
      type: "auth",
    });
  } else {
    User.findOne({ _id: id })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            status: "error",
            message: "You are not authorised",
            type: "auth",
          });
        } else {
          Todo.find({ userid: id, deadline: { $gte: start, $lte: end } })
            .then((result) => {
              res.json({
                status: "success",
                type: "todo",
                message: result,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "error",
                message: "Internel server error",
                type: "todo",
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          status: "error",
          message: "Internel server error",
          type: "auth",
        });
      });
  }
});

router.post("/getuntrackedtodos", (req, res) => {
  const { userid } = req.body;
  if (!ObjectId.isValid(userid)) {
    return res.status(400).json({
      status: "error",
      message: "You are not authorised",
      type: "auth",
    });
  } else {
    User.findOne({ _id: userid }).then((user) => {
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "You are not authorised",
          type: "auth",
        });
      } else {
        Todo.find({
          userid,
          deadline: null,
          projects: [],
        })
          .then((result) => {
            res.json({
              status: "success",
              type: "todo",
              message: result,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              status: "error",
              message: "Internel server error",
              type: "todo",
            });
          });
      }
    });
  }
});

module.exports = router;
