import React, { Component } from "react";
import AddTodo from "../AddTodo";
import DateTodos from "./DateTodos";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodos, getTodosByDate } from "../../actions/todoActions";
import { getProgress } from "../../actions/projectActions";
import ProjectProgress from "../ProjectProgress";
import moment from "moment";
import {
  ChevronDown,
  CheckCircle,
  Circle,
  PlayCircle,
  Home,
} from "react-feather";

class MainContent extends Component {
  state = {
    loading: false,
    fetching: false,
    completion: 0,
    dueTodos: [],
    todayTodos: [],
    upcomingTodos: [],
    dueOpen: true,
    todayOpen: true,
    upcomingOpen: true,
    currentView: "ALL",
  };

  fetchTodos = async () => {
    await this.props.getTodos({
      id: this.props.auth.user.id,
      projectid: this.props.projects.selectedProject.id,
    });
    await this.fetchProgress();
    this.setState({ fetching: false });
  };

  fetchProgress = async () => {
    await getProgress(
      {
        id: this.props.auth.user.id,
        projectid: this.props.projects.selectedProject.id,
      },
      (res) => {
        this.getPercentageCompletion(
          res.data.message[0].done,
          res.data.message[0].total
        );
      }
    );
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedProject !== this.props.projects.selectedProject
    ) {
      if (Object.keys(this.props.projects.selectedProject).length) {
        this.setState({ fetching: true });
        this.fetchTodos();
      }
    }

    if (prevProps.todos.updated_todo !== this.props.todos.updated_todo) {
      if (Object.keys(this.props.todos.updated_todo).length) {
        const { status } = this.props.todos.updated_todo;
        this.props.todos.todos.forEach((todo) => {
          if (todo._id === this.props.todos.updated_todo._id) {
            todo = this.props.todos.updated_todo;
            return;
          }
        });
      }
    }

    if (prevProps.todos.todos !== this.props.todos.todos) {
      if (this.props.todos.todos.length) {
        this.seperateTodosByDate();
      } else {
        this.setState({ dueTodos: [], todayTodos: [], upcomingTodos: [] });
      }
    }

    if (prevProps.todos.new_todo !== this.props.todos.new_todo) {
      if (this.props.projects.selectedMode === "PROJECTS") {
        this.fetchProgress();
        if (this.props.todos.todos.length) {
          this.seperateTodosByDate();
        }
      }
    }
  }

  getPercentageCompletion(completed, total) {
    this.setState({
      completion: completed !== 0 ? completed / total : 0,
    });
  }

  filterByCurrentView(todos) {
    const { currentView } = this.state;
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

  seperateTodosByDate() {
    let todayTodos = [],
      dueTodos = [],
      upcomingTodos = [],
      todos = this.filterByCurrentView(this.props.todos.todos);
    todos.forEach((todo) => {
      if (todo.deadline) {
        if (moment(todo.deadline).isSame(moment(), "day")) {
          todayTodos.push(todo);
        } else if (moment(todo.deadline).isBefore(moment(), "day")) {
          dueTodos.push(todo);
        } else {
          upcomingTodos.push(todo);
        }
      } else {
        upcomingTodos.push(todo);
      }
    });
    this.setState({
      todayTodos,
      dueTodos,
      upcomingTodos,
    });
  }

  renderTodos(todos, isMycategoryOpen) {
    return (
      <div
        className="todo-list-container"
        style={{
          //maxHeight: isMycategoryOpen ? "200vh" : "0vh",
          display: isMycategoryOpen ? "block" : "none",
        }}
      >
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

  changeView(e, view) {
    this.setState({ currentView: view }, () => {
      //this.fetchTodos();
      this.seperateTodosByDate();
    });
  }

  renderToggleViews(styleOptions) {
    return (
      <div className="toggle-views" style={styleOptions}>
        <div className="buttons has-addons">
          <button
            className={
              "button all" +
              (this.state.currentView === "ALL" ? " is-selected" : "")
            }
            disabled={this.state.fetching || this.props.todos.fetching}
            onClick={(e) => this.changeView(e, "ALL")}
          >
            <span className="icon is-small">
              <Home />
            </span>
            <span>All</span>
          </button>
          <button
            className={
              "button todo" +
              (this.state.currentView === "TODO" ? " is-selected" : "")
            }
            onClick={(e) => this.changeView(e, "TODO")}
            disabled={this.state.fetching || this.props.todos.fetching}
          >
            <span className="icon is-small">
              <Circle />
            </span>
            <span>Todo</span>
          </button>
          <button
            className={
              "button doing" +
              (this.state.currentView === "DOING" ? " is-selected" : "")
            }
            onClick={(e) => this.changeView(e, "DOING")}
            disabled={this.state.fetching || this.props.todos.fetching}
          >
            <span className="icon is-small">
              <PlayCircle />
            </span>
            <span>Doing</span>
          </button>
          <button
            className={
              "button done" +
              (this.state.currentView === "DONE" ? " is-selected" : "")
            }
            onClick={(e) => this.changeView(e, "DONE")}
            disabled={this.state.fetching || this.props.todos.fetching}
          >
            <span className="icon is-small">
              <CheckCircle />
            </span>
            <span>Done</span>
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { upcomingTodos, dueTodos, todayTodos } = this.state;
    const { selectedMode, selectedProject } = this.props.projects;
    if (selectedMode === "PROJECTS") {
      return (
        <div className="main-content-container">
          <AddTodo />
          <ProjectProgress
            progress={this.state.completion}
            color={selectedProject.color}
          />

          {this.renderToggleViews()}
          <div className="todos-container">
            {dueTodos.length !== 0 && (
              <>
                <div
                  className="timeline-title"
                  onClick={(e) =>
                    this.setState({ dueOpen: !this.state.dueOpen })
                  }
                >
                  Due Tasks
                  <ChevronDown
                    className="collapse-icon"
                    style={{
                      transform: this.state.dueOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </div>

                {this.renderTodos(dueTodos, this.state.dueOpen)}
              </>
            )}
            {todayTodos.length !== 0 && (
              <>
                <div
                  className="timeline-title"
                  onClick={(e) =>
                    this.setState({ todayOpen: !this.state.todayOpen })
                  }
                >
                  Today
                  <ChevronDown
                    className="collapse-icon"
                    style={{
                      transform: this.state.todayOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </div>

                {this.renderTodos(todayTodos, this.state.todayOpen)}
              </>
            )}
            {upcomingTodos.length !== 0 && (
              <>
                <div
                  className="timeline-title"
                  onClick={(e) =>
                    this.setState({ upcomingOpen: !this.state.upcomingOpen })
                  }
                >
                  Upcoming
                  <ChevronDown
                    className="collapse-icon"
                    style={{
                      transform: this.state.upcomingOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </div>

                {this.renderTodos(upcomingTodos, this.state.upcomingOpen)}
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-content-container">
          <AddTodo />
          {this.renderToggleViews({ marginTop: "10px" })}
          <DateTodos currentView={this.state.currentView} />
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

export default connect(mapStateToProps, { getTodos, getTodosByDate })(
  MainContent
);
