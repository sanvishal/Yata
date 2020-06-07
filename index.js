const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const CORS = require("express-cors");

const users = require("./routes/api/users");
const projects = require("./routes/api/projects");
const todos = require("./routes/api/todos");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const mongoURI = require("./config/keys").mongoURI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() =>
    console.log(
      "[DB] Database connection established and is working real nice!"
    )
  )
  .catch((err) =>
    console.warn(
      "[ERR] There is something funky going on with the database connection ----> " +
        mongoURI +
        "\n",
      err
    )
  );

app.use(passport.initialize());
require("./config/passport")(passport);

// app.options("*", (req, res, next) => {
//   res.sendStatus(204);
// });

app.use(
  CORS({
    allowedOrigins: ["localhost:*", "*.now.sh"],
    headers: ["X-Requested-With", "content-type", "x-access-token"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  })
);

app.options("*", (req, res, next) => {
  res.sendStatus(204);
});

app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/todos", todos);

app.get("/", (req, res) => {
  res.send("Yata");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`[SER] Server is up and running healthy on port ${port} :)`);
});
