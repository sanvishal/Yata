import React, { Component } from "react";

class ProjectProgress extends Component {
  render() {
    let progress = this.props.progress || 0;
    let color = this.props.color;
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
