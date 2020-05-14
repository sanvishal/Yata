const validator = require("validator");
const isEmpty = require("is-empty");

module.exports.validateRegisterData = function (data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_again = !isEmpty(data.password_again)
    ? data.password_again
    : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Do you not have a name?";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Enter your Email pls :3";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Check if the Email is correct";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password is important!";
  }
  if (validator.isEmpty(data.password_again)) {
    errors.password_again = "Re-enter the password";
  }
  if (!validator.isLength(data.password, { min: 6, max: 40 })) {
    errors.password = "Think of a longer password";
  }
  if (!validator.equals(data.password, data.password_again)) {
    errors.password_again = "Hmm..passwords don't seem to match though";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports.validateLoginData = function (data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
