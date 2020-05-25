import React, { Component } from "react";
import AddTodo from "../AddTodo";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodos } from "../../actions/todoActions";
import { getProgress } from "../../actions/projectActions";
import ProjectProgress from "../ProjectProgress";

class MainContent extends Component {
  state = { loading: false, completion: 0 };

  fetchTodos = async () => {
    await this.props.getTodos({
      id: this.props.auth.user.id,
      projectid: this.props.projects.selectedProject.id,
    });
    await this.fetchProgress();
  };

  fetchProgress = async () => {
    await getProgress(
      {
        id: this.props.auth.user.id,
        projectid: this.props.projects.selectedProject.id,
      },
      (res) => {
        console.log(res.data.message[0]);
        this.getPercentageCompletion(res.data.message[0].done);
      }
    );
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedProject !== this.props.projects.selectedProject
    ) {
      if (Object.keys(this.props.projects.selectedProject).length) {
        this.fetchTodos();
      }
    }

    if (prevProps.todos.updated_todo !== this.props.todos.updated_todo) {
      if (Object.keys(this.props.todos.updated_todo).length) {
        this.fetchProgress();
      }
    }
  }

  getPercentageCompletion(completed) {
    console.log(completed, this.props.todos.todos);
    this.setState({
      completion:
        completed !== 0 ? completed / this.props.todos.todos.length : 0,
    });
  }

  render() {
    const { todos } = this.props.todos;
    const { selectedMode, selectedProject } = this.props.projects;
    if (selectedMode === "PROJECTS") {
      return (
        <div className="main-content-container">
          <AddTodo />
          <ProjectProgress
            progress={this.state.completion}
            color={selectedProject.color}
          />
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
