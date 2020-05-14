const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();
const users = require("./routes/api/users");

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

app.use("/api/users", users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[SER] Server is up and running healthy on port ${port} :)`);
});
