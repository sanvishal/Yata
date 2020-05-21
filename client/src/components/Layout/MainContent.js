import React, { Component } from "react";
import AddTodo from "../AddTodo";

class MainContent extends Component {
  render() {
    return (
      <div className="main-content-container">
        <AddTodo />
      </div>
    );
  }
}

export default MainContent;
