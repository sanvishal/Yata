const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const Project = require("../../models/Project");

const router = express.Router();

router.use(function (req, res, next) {
  var token = req.headers["x-access-token"].split(" ")[1];
  if (!token) {
    console.log("no token");
  }
  jwt.verify(token, keys.serverSecret, function (err, decoded) {
    if (err) {
      console.log(err);
    } else {
      console.log("approved", decoded);
      next();
    }
  });
});

router.post("/addproject", (req, res) => {
  console.log(
    req.body,
    "=========================================================="
  );
  return res.json(req.body);
});

module.exports = router;
