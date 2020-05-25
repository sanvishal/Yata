import React, { Component } from "react";

class ProjectProgress extends Component {
  render() {
    const { progress, color } = this.props;
    return (
      <div
        className="project-progress"
        style={{ backgroundColor: color + "25" }}
      >
        <div
          className="progress-bar"
          style={{
            width: (progress * 100).toString() + "%",
            backgroundColor: color,
          }}
        ></div>
      </div>
    );
  }
}

export default ProjectProgress;
