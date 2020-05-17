import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Toast from "../ToastNotification";

class Navbar extends Component {
  onClickLogout = (e) => {
    e.preventDefault();
    Toast.fire({
      title: "Bye Bye :3",
    });
    this.props.logoutUser();
  };

  render() {
    const { auth } = this.props;
    return (
      <div className="navbar-container">
        <nav className="navbar" role="navigation">
          <div class="navbar-brand">
            <div class="navbar-item">
              <Link to="/" className="brand-logo">
                <img src={logo} alt="Yata" />
              </Link>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                {!auth.isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <a class="button">Sign Up</a>
                    </Link>
                    <Link to="/login">
                      <a class="button">Login</a>
                    </Link>
                  </>
                ) : (
                  <a class="button" onClick={(e) => this.onClickLogout(e)}>
                    Logout
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
