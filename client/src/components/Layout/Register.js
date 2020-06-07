import React, { useState, useEffect } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import Toast from "../ToastNotification";

function Register({ registerUser, auth, errors }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_again, setPassword_again] = useState("");
  const [_errors, set_Errors] = useState({});
  const [loading, setLoading] = useState(false);

  let history = useHistory();
  function onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name,
      email,
      password,
      password_again,
    };
    // console.log(newUser);
    setLoading(true);
    registerUser(newUser, history);
  }

  useEffect(() => {
    set_Errors(errors);
    setLoading(false);
    if (typeof errors !== "object") {
      Toast.fire({
        title: errors,
      });
      setLoading(false);
    }
  }, [errors]);

  return (
    <div className="form-container">
      <div className="form-title">
        <h4>
          <b>Register for a new account</b>
        </h4>
        <p style={{ color: "grey", marginBottom: "20px" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <form onSubmit={(e) => onSubmit(e)} className="register-form container">
        <div className="field">
          <label className="label">How do you like us to call you?</label>
          <div className="control">
            <input
              type="text"
              placeholder="What's your nickname?"
              onChange={(e) => setName(e.target.value)}
              className={"form__input name input"}
            />
            {_errors.name && <span class="error">{_errors.name}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">What's your Email?</label>
          <div className="control">
            <input
              className="form__input email input"
              type="email"
              placeholder="iamthe@badguy.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            {_errors.email && <span class="error">{_errors.email}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">Enter a password</label>
          <div className="control">
            <input
              className="form__input password input"
              type="password"
              placeholder="A super secure password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {_errors.password && <span class="error">{_errors.password}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">Enter same password again</label>
          <div className="control">
            <input
              className="form__input input password_again"
              type="password"
              placeholder="A super secure password sagain"
              onChange={(e) => setPassword_again(e.target.value)}
            />
            {_errors.password_again && (
              <span class="error">{_errors.password_again}</span>
            )}
          </div>
        </div>
        <div className="field">
          <p className="control">
            <button
              className={
                "button is-success form__submit" +
                (loading ? " is-loading" : "")
              }
            >
              Lets Go!
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
