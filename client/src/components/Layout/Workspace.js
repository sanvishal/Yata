import React, { Component } from "react";
import PropTypes from "prop-types";
import Toast from "../ToastNotification";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { setMode } from "../../actions/projectActions";

import { connect } from "react-redux";

class Workspace extends Component {
  componentDidMount() {
    Toast.fire({
      title: "Welcome back " + this.props.auth.user.name + " :)",
      customClass: {
        popup: "swal2-popup__success",
      },
    });
    this.props.setMode("EVERYTHING");
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div className="workspace-container">
        <Sidebar />
        <MainContent />
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

export default connect(mapStateToProps, { setMode })(Workspace);
