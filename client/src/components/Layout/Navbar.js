import React, { Component } from "react";
import { Link } from "react-router-dom";
import Gravatar from "react-gravatar";
import logo from "../../assets/logo.png";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Toast from "../ToastNotification";
import { ChevronDown, LogOut } from "react-feather";

class Navbar extends Component {
  state = {
    dropdownOpen: false,
  };

  onClickLogout = (e) => {
    e.preventDefault();
    Toast.fire({
      title: "Bye Bye :3",
    });
    this.props.logoutUser();
  };

  toggleDropdown = (e) => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    const { auth } = this.props;
    return (
      <div className="navbar-container">
        <nav className="navbar" role="navigation">
          <div className="navbar-brand">
            <div className="navbar-item">
              <Link to="/" className="brand-logo">
                <img src={logo} alt="Yata" />
              </Link>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {!auth.isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <a className="button">Sign Up</a>
                    </Link>
                    <Link to="/login">
                      <a className="button">Login</a>
                    </Link>
                  </>
                ) : (
                  <div
                    className={
                      "dropdown is-right" +
                      (this.state.dropdownOpen ? " is-active" : "")
                    }
                    onClick={(e) => this.toggleDropdown(e)}
                    onBlur={(e) => this.toggleDropdown(e)}
                  >
                    <div className="dropdown-trigger">
                      <Gravatar
                        email={auth.user.email}
                        className="profile-pic"
                        size={25}
                      />
                      <div
                        style={{
                          fontSize: "1em",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {auth.user.name}
                      </div>
                      <div class="dropdown-icon">
                        <ChevronDown />
                      </div>
                    </div>
                    <div
                      class="dropdown-menu"
                      id="dropdown-menu-nav"
                      role="menu"
                    >
                      <div className="dropdown-content">
                        <a
                          onClick={(e) => this.onClickLogout(e)}
                          class="dropdown-item"
                        >
                          <span>
                            <LogOut />
                          </span>
                          Logout
                        </a>
                      </div>
                    </div>
                  </div>
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
