const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const mongoURI = require("./config/keys").mongoURI;
console.log(mongoURI);
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[SER] Server is up and running healthy on port ${port} :)`);
});
