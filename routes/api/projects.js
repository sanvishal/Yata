const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const isEmpty = require("is-empty");
const ObjectId = require("mongoose").Types.ObjectId;

const Project = require("../../models/Project");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

const router = express.Router();

router.use(function (req, res, next) {
  var token = req.headers["x-access-token"].split(" ")[1];

  if (!token) {
    return res.status(401).json({
      type: "auth",
      message: "You are not authorized to access",
      status: "error",
    });
  }
  jwt.verify(token, keys.serverSecret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        type: "auth",
        message: "You are not authorized to access",
        status: "error",
      });
    } else {
      //console.log("approved", decoded);
      next();
    }
  });
});

router.post("/addproject", (req, res) => {
  const { id, projectname, color } = req.body;

  if (isEmpty(projectname) || !ObjectId.isValid(id)) {
    return res.status(400).json({
      type: "project",
      message: "An unexpected error",
      status: "error",
    });
  } else {
    User.findOne({ _id: id }).then((user) => {
      if (user) {
        let newProject = new Project({
          projectname,
          color,
          userid: user._id,
        });
        console.log(newProject);

        newProject
          .save()
          .then((newproj) => {
            return res.json({
              status: "success",
              message: newproj,
              type: "project",
            });
          })
          .catch((err) => {
            return res.status(500).json({
              type: "project",
              message: "can't create your project :(",
              status: "error",
            });
          });
      } else {
        return res.status(401).json({
          type: "auth",
          message: "You are not authorized to access",
          status: "error",
        });
      }
    });
  }
});

router.post("/getprojects", (req, res) => {
  const { id } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(401).json({
      type: "auth",
      message: "You are not authorised",
      status: "error",
    });
  } else {
    Project.find({ userid: id })
      .then((projects) => {
        let result = [];
        projects.forEach((project) => {
          result.push({
            projectname: project.projectname,
            color: project.color,
            timestamp: project.date,
            id: project._id,
          });
        });

        return res.json({
          status: "success",
          type: "project",
          message: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          type: "project",
          message: "Whoops, something happened :(",
          status: "error",
        });
      });
  }
});

router.post("/getprogress", (req, res) => {
  const { id, projectid } = req.body;

  if (!ObjectId.isValid(projectid) || !ObjectId.isValid(projectid)) {
    return res.status(400).json({
      type: "project",
      message: "You are not authorised",
      status: "error",
    });
  } else {
    Todo.aggregate([
      {
        $match: {
          done: true,
          projects: { $elemMatch: { projectid: ObjectId(projectid) } },
          userid: ObjectId(id),
        },
      },
      {
        $group: {
          _id: projectid,
          done: {
            $sum: { $cond: ["$done", 1, 0] },
          },
        },
      },
    ]).then((result) => {
      Todo.countDocuments({
        userid: id,
        projects: { $elemMatch: { projectid } },
      }).then((cnt) => {
        result[0]["total"] = cnt;
        return res.json({
          status: "success",
          type: "project",
          message:
            result.length !== 0
              ? result
              : [{ _id: projectid, done: 0, total: cnt }],
        });
      });
    });
  }
});

module.exports = router;
