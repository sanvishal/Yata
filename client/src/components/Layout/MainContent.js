import React, { Component } from "react";
import AddTodo from "../AddTodo";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodos } from "../../actions/todoActions";

class MainContent extends Component {
  state = { loading: false };

  fetchTodos = async () => {
    await this.props.getTodos({
      id: this.props.auth.user.id,
      projectid: this.props.projects.selectedProject.id,
    });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedProject !== this.props.projects.selectedProject
    ) {
      if (Object.keys(this.props.projects.selectedProject).length) {
        this.fetchTodos();
      }
    }
  }

  render() {
    const { todos } = this.props.todos;
    const { selectedMode } = this.props.projects;
    if (selectedMode === "PROJECTS") {
      return (
        <div className="main-content-container">
          <AddTodo />
          <div className="todo-list-container">
            {todos.map((todo, key) => {
              return (
                <Todo
                  task={todo.task}
                  status={todo.status}
                  id={todo._id}
                  className="fadeInUp"
                  key={key}
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-content-container">
          <AddTodo />
          <div>{selectedMode}</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, { getTodos })(MainContent);
