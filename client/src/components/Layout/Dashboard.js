import React, { Component } from "react";
import { connect } from "react-redux";

const greetUser = (uname) => {
  let today = new Date();
  let currhours = today.getHours();

  if (currhours < 12) {
    return "Good Morning " + uname;
  } else if (currhours < 18) {
    return "Good Afternoon " + uname;
  } else {
    return "Good Evening " + uname;
  }
};

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <div className="top-header">
          <div className="greet">{greetUser(this.props.auth.user.name)}</div>
          <div className="greet-subtitle">
            Welcome to your workspace, let's get some work done!
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Dashboard);
