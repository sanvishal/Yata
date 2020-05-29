import React, { Component } from "react";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodosByDate } from "../../actions/todoActions";
import moment from "moment";

class DateTodos extends Component {
  state = {
    todos: [],
  };

  fetchTodosByDate = async (date) => {
    await this.props.getTodosByDate({
      id: this.props.auth.user.id,
      date,
    });
    this.setState({ todos: this.props.todos.todos });
  };

  fetchOnUpdate() {
    const { selectedMode } = this.props.projects;
    if (selectedMode === "TODAY") {
      this.fetchTodosByDate(moment().startOf("day"));
    } else if (selectedMode === "TOMORROW") {
      this.fetchTodosByDate(moment().startOf("day").add(1, "days"));
    }
  }

  componentDidMount() {
    this.fetchOnUpdate();
  }

  shouldPropsUpdate(date) {
    let selectedDate = moment(date);
    let today = moment();
    let tomorrow = moment().add(1, "day");
    if (
      selectedDate.isSame(today, "day") &&
      this.props.projects.selectedMode === "TODAY"
    ) {
      return true;
    } else if (
      selectedDate.isSame(tomorrow, "day") &&
      this.props.projects.selectedMode === "YESTERDAY"
    ) {
      return false;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projects.selectedMode !== this.props.projects.selectedMode) {
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
  }

  filterByCurrentView(todos) {
    const { currentView } = this.props;
    switch (currentView) {
      case "TODO":
        return todos.filter((todo) => todo.status === 0, todos);
      case "DOING":
        return todos.filter((todo) => todo.status === 1, todos);
      case "DONE":
        return todos.filter((todo) => todo.status === 2, todos);
      default:
        return todos;
    }
  }

  renderTodos(todos) {
    todos = this.filterByCurrentView(todos);
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
              key={key}
            />
          );
        })}
      </div>
    );
  }

  // shouldComponentUpdate(prevState) {
  //   return this.props.todos.todos !== prevState.todos;
  // }

  render() {
    const { todos } = this.state;
    return <div className="todos-container">{this.renderTodos(todos)}</div>;
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, { getTodosByDate })(DateTodos);
