import React, { Component } from "react";
import AddTodo from "../AddTodo";
import DateTodos from "./DateTodos";
import UntrackedTodos from "./UntrackedTodos";
import { connect } from "react-redux";
import Todo from "../Todo";
import Dashboard from "./Dashboard";
import { getTodos, getTodosByDate } from "../../actions/todoActions";
import { getProgress, deleteProject } from "../../actions/projectActions";
import ProjectProgress from "../ProjectProgress";
import Toast from "../ToastNotification";
import moment from "moment";
import {
  ChevronDown,
  CheckCircle,
  Circle,
  PlayCircle,
  Home,
  Calendar as Cal,
  X,
  Archive,
  Trash2,
} from "react-feather";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";

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
    calendarOpen: false,
    selectedDate: "",
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
          res.data.message.done,
          res.data.message.total
        );
      }
    );
  };

  recalculateProgressOnUpdate() {
    let total = 0,
      done = 0;
    this.props.todos.todos.forEach((todo) => {
      if (!todo.archived) {
        total++;
        if (todo.status === 2) {
          done++;
        }
      }
    });
    this.getPercentageCompletion(done, total);
  }

  updatePropsOnDataChange() {
    const { updated_todo } = this.props.todos;
    let todos = this.props.todos.todos;
    let isArchiveToggled = false;
    for (let idx in todos) {
      if (todos[idx]._id === this.props.todos.updated_todo._id) {
        todos[idx].status = updated_todo.status;
        todos[idx].done_date = moment().toISOString();
        if (todos[idx].archived !== updated_todo.archived) {
          todos[idx].archived = updated_todo.archived;
          isArchiveToggled = true;
        }

        break;
      }
    }
    this.props.todos.todos = todos;
    if (isArchiveToggled) {
      this.seperateTodosByDate();
    }
  }

  updatePropsOnTodoAdd() {
    const { new_todo } = this.props.todos;

    const { selectedProject } = this.props.projects;
    const { projects } = new_todo;
    let newTodos = this.props.todos.todos;
    projects.forEach((project) => {
      if (selectedProject.projectid === project._id) {
        newTodos.push(new_todo);
        this.props.todos.todos = newTodos;
        return;
      }
    });
  }

  updatePropsonTodoDelete(deleted_todo) {
    let newTodos = this.props.todos.todos;
    newTodos.forEach((todo, idx, obj) => {
      if (todo._id === deleted_todo) {
        obj.splice(idx, 1);
        return;
      }
    });
    this.props.todos.todos = newTodos;
    this.seperateTodosByDate();
    this.recalculateProgressOnUpdate();
  }

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
        this.updatePropsOnDataChange();
        this.recalculateProgressOnUpdate();
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
        this.updatePropsOnTodoAdd();
        if (this.props.todos.todos.length) {
          this.seperateTodosByDate();
        }
      }
    }

    if (prevProps.todos.deleted_todo !== this.props.todos.deleted_todo) {
      if (this.props.todos.deleted_todo.length) {
        const { deleted_todo } = this.props.todos;
        this.updatePropsonTodoDelete(deleted_todo);
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

  renderTodos(todos, isMyCategoryOpen) {
    return (
      <div
        className="todo-list-container"
        style={{
          //maxHeight: isMycategoryOpen ? "200vh" : "0vh",
          display: isMyCategoryOpen ? "block" : "none",
        }}
      >
        {todos.map((todo, key) => {
          return (
            <Todo
              task={todo.task}
              status={todo.status}
              id={todo._id}
              deadline={todo.deadline}
              archived={todo.archived}
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

  toggleCalender(e) {
    this.setState({ calendarOpen: !this.state.calendarOpen });
  }

  updatePropsonDeleteProject(id) {
    let newProjects = this.props.projects.projects;
    if (id.length) {
      newProjects.forEach((project, idx, obj) => {
        if (project.id === id) {
          obj.splice(idx, 1);
        }
      });
      this.props.projects.projects = newProjects;
      Toast.fire({
        title: "Safely deleted the project",
        customClass: {
          popup: "swal2-popup__success",
        },
      });
    }
  }

  _deleteProject = async (projectid, id) => {
    await this.props.deleteProject({
      id,
      projectid,
    });
    this.updatePropsonDeleteProject(this.props.projects.deleted_project);
  };

  onClickDeleteProject() {
    Swal.fire({
      title: "Do you really want to delete this project and linked tasks?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: "Do it!",
    }).then((result) => {
      if (result.value) {
        this._deleteProject(
          this.props.projects.selectedProject.id,
          this.props.auth.user.id
        );
      }
    });
  }

  renderToggleViews() {
    return (
      <div className="toggle-views">
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
          <button
            className={
              "button archived" +
              (this.state.currentView === "ARCHIVED" ? " is-selected" : "")
            }
            onClick={(e) => this.changeView(e, "ARCHIVED")}
            disabled={this.state.fetching || this.props.todos.fetching}
          >
            <span className="icon is-small">
              <Archive />
            </span>
            <span>Archived</span>
          </button>
        </div>
      </div>
    );
  }

  renderProperIllustration() {
    switch (this.state.currentView) {
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
            <span>
              Seems like you've completed all tasks in{" "}
              {"#" + this.props.projects.selectedProject.projectname}, now rest
            </span>
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
              There are no tasks in this tag, tag{" "}
              {"#" + this.props.projects.selectedProject.projectname} while
              adding a task
            </span>
          </div>
        );

      case "ARCHIVED":
        return (
          <div className="nothing">
            <div className="illustration">😵</div>
            <span>
              You did not archive any todos; to archive, go to Edit Todo.
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
          <div className="options-bar">
            {this.renderToggleViews()}
            <button
              className={"button delete-project"}
              onClick={(e) => this.onClickDeleteProject()}
            >
              <span className="icon is-small">
                <Trash2 />
              </span>
              <span>Delete</span>
            </button>
          </div>
          {!this.state.fetching ? (
            upcomingTodos.length || dueTodos.length || todayTodos.length ? (
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
                        this.setState({
                          upcomingOpen: !this.state.upcomingOpen,
                        })
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
            ) : (
              this.renderProperIllustration()
            )
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
        </div>
      );
    } else if (
      selectedMode === "TOMORROW" ||
      selectedMode === "TODAY" ||
      selectedMode === "UPCOMING"
    ) {
      return (
        <div className="main-content-container">
          <AddTodo />

          <div className="options-bar" style={{ marginTop: "10px" }}>
            {selectedMode === "UPCOMING" && (
              <button
                className={
                  "button calender-toggle" +
                  (this.state.calendarOpen ? " is-selected" : "")
                }
                onClick={(e) => this.toggleCalender(e)}
              >
                <span className="icon is-small">
                  <Cal />
                </span>
                <span>
                  {this.state.selectedDate
                    ? moment(this.state.selectedDate).format("DD-MMM-YYYY")
                    : "Select Date"}
                </span>
                <span className="icon is-small close-icon">
                  <X />
                </span>
              </button>
            )}
            {this.renderToggleViews()}
          </div>
          <div className="calender-select upcoming-calender">
            {selectedMode === "UPCOMING" && this.state.calendarOpen && (
              <Calendar
                onChange={(date) => this.setState({ selectedDate: date })}
              />
            )}
          </div>
          <DateTodos
            currentView={this.state.currentView}
            selectedDate={this.state.selectedDate}
          />
        </div>
      );
    } else if (selectedMode === "UNTRACKED") {
      return (
        <div className="main-content-container">
          <AddTodo />
          <div className="options-bar" style={{ marginTop: "10px" }}>
            {this.renderToggleViews()}
          </div>
          <UntrackedTodos currentView={this.state.currentView} />
        </div>
      );
    } else {
      return (
        <div className="main-content-container">
          <AddTodo />
          <Dashboard />
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

export default connect(mapStateToProps, {
  getTodos,
  getTodosByDate,
  deleteProject,
})(MainContent);
