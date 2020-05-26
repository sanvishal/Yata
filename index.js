const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressJWT = require("express-jwt");
const app = express();

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
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(
      "[DB] Database connection established and is working real nice!"
    )
  )
  .catch((err) =>
    console.warn(
      "[ERR] There is something funky going on with the database connection ---->\n",
      err
    )
  );

app.use(passport.initialize());
require("./config/passport")(passport);

// app.use((req, res, next) => {
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

// app.options(
//   "*",
//   cors({
//     credentials: true,
//     origin: "*",
//     optionsSuccessStatus: 200,
//   })
// );
app.use(
  cors({
    credentials: true,
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

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
