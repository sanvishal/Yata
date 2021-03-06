const express = require("express");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const keys = require("../../config/keys");
const validators = require("../../helpers/validators");

const User = require("../../models/User");

const router = express.Router();

// router.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type,content-encoding,x-access-token"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

router.options("*", (req, res, next) => {
  res.sendStatus(204);
});

router.post("/register", (req, res) => {
  const { errors, isValid } = validators.validateRegisterData(req.body);
  // console.log(req.body);

  if (!isValid) {
    return res
      .status(400)
      .json({ message: errors, status: "error", type: "auth" });
  }

  User.findOne({ email: req.body.email }).then((alreadyexists) => {
    if (alreadyexists) {
      return res.status(400).json({
        status: "error",
        type: "auth",
        message: "This Email seems to be already registered ._.",
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(15, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw console.log(
              "[AUTH] Something fishy happened while encrypting the password"
            );
          }

          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({ status: "success", message: user, type: "auth" })
            )
            .catch((err) => {
              res.status(400).json({
                type: "auth",
                message: "Something funky happened, we'll investigate ;_;",
                staus: "error",
              });
            });
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validators.validateLoginData(req.body);

  if (!isValid) {
    return res
      .status(400)
      .json({ message: errors, status: "error", type: "auth" });
  }

  const { email, password } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).json({
        status: "error",
        type: "auth",
        message: "Please register to continue ._.",
      });
    } else {
      bcrypt.compare(password, user.password).then((matches) => {
        if (matches) {
          const jwt_payload = {
            id: user._id,
            name: user.name,
            email: user.email,
          };

          jsonwebtoken.sign(
            jwt_payload,
            keys.serverSecret,
            {
              expiresIn: 31247891,
            },
            (err, token) => {
              if (err) {
                throw console.log(
                  "[AUTH] Something happened at JWT signing ---->\n",
                  err
                );
              }
              // res.cookie("JWT", "Bearer " + token, {
              //   httpOnly: true,
              //   secure: true,
              // });
              return res.json({ status: "success", token: "Bearer " + token });
            }
          );
        } else {
          return res.status(400).json({
            status: "error",
            type: "auth",
            message: "Invalid login credentials :(",
          });
        }
      });
    }
  });
});

module.exports = router;
