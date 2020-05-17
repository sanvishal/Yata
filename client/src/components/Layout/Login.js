import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import Toast from "../ToastNotification";

function Login({ loginUser, auth, errors }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_errors, set_Errors] = useState({});
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  function onSubmit(e) {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    console.log(user);
    setLoading(true);
    loginUser(user);
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoading(false);
      history.push("/workspace");
    }
    if (errors.toast) {
      set_Errors(errors);
      Toast.fire({
        title: errors.message,
      });
      setLoading(false);
      return;
    }
    set_Errors(errors);
    setLoading(false);
  }, [auth, errors]);

  return (
    <div className="form-container">
      <div className="form-title">
        <h4>
          <b>Login to your Workspace</b>
        </h4>
        <p style={{ color: "grey", marginBottom: "20px" }}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>

      <form onSubmit={(e) => onSubmit(e)} className="login-form container">
        <div className="field">
          <label className="label">Your Email</label>
          <div className="control">
            <input
              className="form__input email input"
              type="email"
              placeholder="iamthebad@guy.duh"
              onChange={(e) => setEmail(e.target.value)}
            />
            {_errors.email && <span class="error">{_errors.email}</span>}
          </div>
        </div>
        <div className="field">
          <label className="label">Your password</label>
          <div className="control">
            <input
              className="form__input email input"
              type="password"
              placeholder="Enter your super secure password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {_errors.password && <span class="error">{_errors.password}</span>}
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
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
