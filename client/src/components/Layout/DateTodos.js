import React, { Component } from "react";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodosByDate } from "../../actions/todoActions";
import moment from "moment";
class DateTodos extends Component {
  state = {
    todos: [],
  };

  fetchTodosByDate = async (start, end) => {
    await this.props.getTodosByDate({
      id: this.props.auth.user.id,
      start,
      end,
    });
    this.setState({ todos: this.props.todos.todos });
  };

  fetchOnUpdate() {
    const { selectedMode } = this.props.projects;
    if (selectedMode === "TODAY") {
      this.fetchTodosByDate(
        moment().startOf("day").toISOString(),
        moment().endOf("day").toISOString()
      );
    } else if (selectedMode === "TOMORROW") {
      this.fetchTodosByDate(
        moment().startOf("day").add(1, "days").toISOString(),
        moment().endOf("day").add(1, "days").toISOString()
      );
    } else if (selectedMode === "UPCOMING") {
      const { selectedDate } = this.props;
      if (selectedDate) {
        this.fetchTodosByDate(
          moment(this.props.selectedDate).startOf("day").toISOString(),
          moment(this.props.selectedDate).endOf("day").toISOString()
        );
      }
    }
  }

  componentDidMount() {
    this.fetchOnUpdate();
  }

  shouldPropsUpdate(date) {
    const { selectedMode } = this.props.projects;
    let selectedDate = moment(date);
    let today = moment();
    let tomorrow = moment().add(1, "day");
    let upcomingDate = moment(this.props.selectedDate);
    if (selectedDate.isSame(today, "day") && selectedMode === "TODAY") {
      return true;
    } else if (
      selectedDate.isSame(tomorrow, "day") &&
      selectedMode === "TOMORROW"
    ) {
      return true;
    } else if (
      selectedDate.isSame(upcomingDate, "day") &&
      selectedMode === "UPCOMING"
    ) {
      return true;
    }
    return false;
  }

  // updatePropsOnStatusChange() {
  //   const { status } = this.props.todos.updated_todo;
  //   let todos = this.props.todos.todos;
  //   for (let idx in todos) {
  //     if (todos[idx]._id === this.props.todos.updated_todo._id) {
  //       todos[idx].status = status;
  //       break;
  //     }
  //   }
  //   this.props.todos.todos = todos;
  //   this.setState({ todos: this.props.todos.todos });
  // }

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedMode !== this.props.projects.selectedMode ||
      prevProps.selectedDate !== this.props.selectedDate ||
      (prevProps.todos.edit_todo.modal_open === true &&
        this.props.todos.edit_todo.modal_open === false &&
        this.props.todos.edit_todo.refetch)
    ) {
      this.setState({ todos: [] });
      this.fetchOnUpdate();
    }

    if (prevProps.todos.new_todo !== this.props.todos.new_todo) {
      if (this.props.todos.new_todo.deadline) {
        if (this.shouldPropsUpdate(this.props.todos.new_todo.deadline)) {
          this.props.todos.todos = [
            ...this.props.todos.todos,
            this.props.todos.new_todo,
          ];

          this.setState({ todos: this.props.todos.todos });
        }
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
      if (
        !this.props.selectedDate &&
        this.props.projects.selectedMode === "UPCOMING"
      ) {
        return (
          <div className="nothing">
            <div className="illustration">🔍</div>
            <span>Select a date to view todos on that date</span>
          </div>
        );
      }
      switch (this.props.currentView) {
        case "DOING":
          return (
            <div className="nothing">
              <div className="illustration">😊</div>
              <span>
                {this.props.projects.selectedMode === "TODAY" &&
                  "There are no on-going tasks for today, check your todos!"}
                {this.props.projects.selectedMode === "TOMORROW" &&
                  "You aren't working on any tasks early for tomorrow"}
                {this.props.projects.selectedMode === "UPCOMING" &&
                  "There are no on-going tasks dated " +
                    moment(this.props.selectedDate).format("DD MMM")}
              </span>
            </div>
          );
        case "TODO":
          return (
            <div className="nothing">
              <div className="illustration">🎉</div>
              <span>
                {this.props.projects.selectedMode === "TODAY" &&
                  "Seems like you've completed all tasks for today, you deserve some break time!"}
                {this.props.projects.selectedMode === "TOMORROW" &&
                  "Seems like you've completed all tasks early for tomorrow"}
                {this.props.projects.selectedMode === "UPCOMING" &&
                  "Seems like you've completed all tasks dated " +
                    moment(this.props.selectedDate).format("DD MMM")}
              </span>
            </div>
          );

        case "DONE":
          return (
            <div className="nothing">
              <div className="illustration">😐</div>
              <span>
                {this.props.projects.selectedMode === "TODAY" &&
                  "You did not complete any tasks today"}
                {this.props.projects.selectedMode === "TOMORROW" &&
                  "You didn't complete any tasks early for tomorrow"}
                {this.props.projects.selectedMode === "UPCOMING" &&
                  "There are no completed tasks dated " +
                    moment(this.props.selectedDate).format("DD MMM")}
              </span>
            </div>
          );

        case "ARCHIVED":
          return (
            <div className="nothing">
              <div className="illustration">😵</div>
              <span>
                {this.props.projects.selectedMode === "TODAY" &&
                  "You did archive any tasks today"}
                {this.props.projects.selectedMode === "TOMORROW" &&
                  "You did not archive any tasks for tomorrow"}
                {this.props.projects.selectedMode === "UPCOMING" &&
                  "There are no archived tasks dated " +
                    moment(this.props.selectedDate).format("DD MMM")}
              </span>
            </div>
          );

        case "ALL":
          return (
            <div className="nothing">
              <div className="illustration">⭐</div>
              <span>
                {this.props.projects.selectedMode === "TODAY" &&
                  "There are no pending tasks for today! Enjoy your time :)"}
                {this.props.projects.selectedMode === "TOMORROW" &&
                  "There are no tasks added for tomorrow, go ahead and plan :)"}
                {this.props.projects.selectedMode === "UPCOMING" &&
                  "There are no tasks dated " +
                    moment(this.props.selectedDate).format("DD MMM")}
              </span>
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

export default connect(mapStateToProps, { getTodosByDate })(DateTodos);
