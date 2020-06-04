import React, { Component } from "react";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getUntrackedTodos } from "../../actions/todoActions";
import moment from "moment";

class UntrackedTodos extends Component {
  state = {
    todos: [],
  };

  fetchUntrackedTodos = async () => {
    await this.props.getUntrackedTodos({
      userid: this.props.auth.user.id,
    });
    await this.setState({ todos: this.props.todos.todos });
  };

  componentDidMount() {
    this.fetchUntrackedTodos();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedMode !== this.props.projects.selectedMode ||
      (prevProps.todos.edit_todo.modal_open === true &&
        this.props.todos.edit_todo.modal_open === false &&
        this.props.todos.edit_todo.refetch)
    ) {
      this.fetchUntrackedTodos();
    }

    if (prevProps.todos.new_todo !== this.props.todos.new_todo) {
      const { new_todo } = this.props.todos;
      if (!new_todo.deadline && new_todo.projects.length === 0) {
        this.props.todos.todos = [
          ...this.props.todos.todos,
          this.props.todos.new_todo,
        ];

        this.setState({ todos: this.props.todos.todos });
      }
    }

    if (prevProps.todos.updated_todo !== this.props.todos.updated_todo) {
      this.setState({ todos: this.props.todos.todos });
    }
  }

  filterByCurrentView(todos) {
    const { currentView } = this.props;
    switch (currentView) {
      case "TODO":
        return todos.filter(
          (todo) =>
            todo.status === 0 &&
            (todo.archived === false || todo.archived === null),
          todos
        );
      case "DOING":
        return todos.filter(
          (todo) =>
            todo.status === 1 &&
            (todo.archived === false || todo.archived === null),
          todos
        );
      case "DONE":
        return todos.filter(
          (todo) =>
            todo.status === 2 &&
            (todo.archived === false || todo.archived === null),
          todos
        );
      case "ARCHIVED":
        return todos.filter((todo) => todo.archived === true, todos);
      default:
        return todos.filter(
          (todo) => todo.archived === false || todo.archived === null,
          todos
        );
    }
  }

  renderTodos(todos) {
    todos = this.filterByCurrentView(todos);
    if (todos.length) {
      return (
        <div className="todo-list-container">
          {todos.map((todo, key) => {
            return (
              <Todo
                task={todo.task}
                status={todo.status}
                id={todo._id}
                deadline={todo.deadline}
                className="fadeInUp"
                archived={todo.archived}
                key={key}
              />
            );
          })}
        </div>
      );
    } else {
      switch (this.props.currentView) {
        case "DOING":
          return (
            <div className="nothing">
              <div className="illustration">😊</div>
              <span>
                You don't have any on-going tasks, assign some tasks to yourself
              </span>
            </div>
          );
        case "TODO":
          return (
            <div className="nothing">
              <div className="illustration">🎉</div>
              <span>Seems like you've completed add tasks! Now go rest</span>
            </div>
          );

        case "DONE":
          return (
            <div className="nothing">
              <div className="illustration">😐</div>
              <span>You didn't complete any tasks...yet</span>
            </div>
          );

        case "ALL":
          return (
            <div className="nothing">
              <div className="illustration">⭐</div>
              <span>
                There are no untracked tasks; to add one, just type in a task
                without a tag and a deadline
              </span>
            </div>
          );

        case "ARCHIVED":
          return (
            <div className="nothing">
              <div className="illustration">😵</div>
              <span>There are no archived tasks</span>
            </div>
          );

        default:
          return (
            <div className="nothing">
              <div className="illustration">😓</div>
              <span>Bear with me here, while I load all your tasks...</span>
              <div
                className="loader"
                style={{
                  marginTop: "10px",
                  width: "28px",
                  height: "28px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  border: "2px solid #4c5258",
                  borderRightColor: "transparent",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          );
      }
    }
  }

  render() {
    const { todos } = this.state;
    return (
      <>
        {!this.props.todos.fetching ? (
          <div className="todos-container">{this.renderTodos(todos)}</div>
        ) : (
          <div className="nothing">
            <div className="illustration">😓</div>
            <span>Bear with me here, while I load all your tasks...</span>
            <div
              className="loader"
              style={{
                marginTop: "10px",
                width: "28px",
                height: "28px",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                border: "2px solid #4c5258",
                borderRightColor: "transparent",
                borderTopColor: "transparent",
              }}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, { getUntrackedTodos })(UntrackedTodos);
