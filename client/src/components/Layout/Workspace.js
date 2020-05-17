import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Toast from "../ToastNotification";

class Workspace extends Component {
  componentDidMount() {
    Toast.fire({
      title: "Welcome back " + this.props.auth.user.name + " :)",
      customClass: {
        popup: "swal2-popup__success",
      },
    });
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        {user.name}
      </div>
    );
  }
}

Workspace.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Workspace);
