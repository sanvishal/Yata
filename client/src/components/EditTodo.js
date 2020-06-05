import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  XCircle,
  Edit,
  Calendar as Cal,
  Hash,
  Activity,
  Star,
  Award,
  Edit3,
  Edit2,
  Circle,
  CheckCircle,
  PlayCircle,
  X,
  Check,
  Trash2,
  Archive,
} from "react-feather";
import {
  toggleModal,
  editTodo,
  getTodos,
  archiveTodo,
  deleteTodo,
} from "../actions/todoActions";
import { addProject } from "../actions/projectActions";
import getRandomColor from "../utils/getRandomColor";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const extractProjects = (str) => {
  let splitStr = str.split(" "),
    filteredStr = splitStr.filter(
      (x) => x.startsWith("#") && x.length > 1,
      splitStr
    );

  if (filteredStr.length) {
    return filteredStr.map((x) => x.substring(1), filteredStr);
  } else {
    return [];
  }
};

const laymansDeepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const getDiffDays = (from, to) => {
  return moment(from).diff(to, "days");
};

const getFormattedDiffDay = (from, to) => {
  let diff = getDiffDays(from, to);
  if (diff === 0 || diff === 1) {
    return `${diff} day`;
  } else {
    return `${diff} days`;
  }
};

const deepCompare = (obj1, obj2) => {
  for (var p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      case "object":
        if (!deepCompare(obj1[p], obj2[p])) return false;
        break;
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }
  for (var p in obj2) {
    if (typeof obj1[p] == "undefined") return false;
  }
  return true;
};

class EditTodo extends Component {
  state = {
    deadlineEditorOpen: false,
    statusEditorOpen: false,
    selectedTodo: {},
    editedTodo: {},
    projectNames: [],
    calendarOpen: false,
    deleting: false,
    archiving: false,
    saving: false,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.todos.edit_todo !== this.props.todos.edit_todo &&
      this.props.todos.edit_todo.modal_open
    ) {
      let todos = this.props.todos.todos;
      const { id } = this.props.todos.edit_todo;
      todos.forEach((todo) => {
        if (todo._id === id) {
          this.setState(
            {
              selectedTodo: laymansDeepCopy(todo),
              editedTodo: laymansDeepCopy(todo),
            },
            () => {
              document
                .getElementById("edit-input")
                .getElementsByTagName("input")[0]
                .focus();
            }
          );
          return;
        }
      });
    }

    if (
      prevProps.projects.projects !== this.props.projects.projects ||
      prevProps.projects.new_project !== this.props.projects.new_project
    ) {
      let projectNames = [];
      this.props.projects.projects.forEach((project) => {
        projectNames.push(project.projectname);
      });
      this.setState({ projectNames });
    }
  }

  fetchTodos = async () => {
    await this.props.getTodos({
      id: this.props.auth.user.id,
      projectid: this.props.projects.selectedProject.id,
    });
  };

  _deleteTodo = async () => {
    this.setState({ deleting: true });
    await this.props.deleteTodo({
      userid: this.props.auth.user.id,
      todoid: this.state.selectedTodo._id,
    });
    this.setState({ deleting: false });
    this.onClickCloseModal();
  };

  onClickCloseModal(e, refetch = false) {
    this.setState(
      {
        selectedTodo: {},
        editedTodo: {},
        taskEditorOpen: false,
      },
      () => {
        this.props.toggleModal({
          modal_open: false,
          id: "",
          refetch: refetch,
        });
      }
    );
  }

  projectAlreadyExists(pname) {
    let projects = this.props.projects.projects;
    let pid = "";
    projects.forEach((project) => {
      if (project.projectname === pname) {
        pid = project.id;
      }
    });
    return pid;
  }

  setupNonExistingProjects(pname) {
    let pid = this.projectAlreadyExists(pname);
    if (pid) {
      return {
        projectname: pname,
        projectid: pid,
      };
    } else {
      return {
        projectname: pname,
        projectid: "",
      };
    }
  }

  onEditTask(val) {
    let editedTodo = this.state.editedTodo;
    editedTodo.task = val;
    let editedProjects = [];
    if (this.state.selectedTodo.task !== val) {
      let parsedProjects = extractProjects(val);

      parsedProjects.forEach((project) => {
        editedProjects.push(this.setupNonExistingProjects(project));
      });
    }
    editedTodo.projects = editedProjects;
    this.setState({ editedTodo });
  }

  checkTrigger() {
    return this.state.editedTodo.task.length ? " #" : "#";
  }

  onChangeNotes(e) {
    let editedTodo = this.state.editedTodo;
    editedTodo.notes = e.target.value;
    this.setState({ editedTodo });
  }

  editDeadline(date) {
    let editedTodo = this.state.editedTodo;
    editedTodo.deadline = date;
    this.setState({ editedTodo });
  }

  changeStatus(e, status) {
    let editedTodo = this.state.editedTodo;
    if (status === 2) {
      editedTodo.done_date = moment().toISOString();
      editedTodo.status = status;
      editedTodo.done = true;
    } else {
      editedTodo.done_date = null;
      editedTodo.status = status;
      editedTodo.done = false;
    }
    this.setState({ editedTodo });
  }

  addNonExistingProjects = async () => {
    let editedProjects = this.state.editedTodo.projects;
    for (let project of editedProjects) {
      if (!project.projectid) {
        await this.props.addProject({
          projectname: project.projectname,
          id: this.props.auth.user.id,
          color: getRandomColor(),
        });
        project.projectid = this.props.projects.new_project._id;
      }
    }
    let editedTodo = this.state.editedTodo;
    editedTodo.projects = editedProjects;
    this.setState({
      editedTodo,
    });
  };

  _saveEditedTodo = async () => {
    this.setState({ saving: true });
    await this.props.editTodo({
      userid: this.props.auth.user.id,
      todoid: this.state.selectedTodo._id,
      newtodo: this.state.editedTodo,
    });
    let todos = this.props.todos.todos;
    for (let idx in todos) {
      if (todos[idx]._id === this.props.todos.updated_todo._id) {
        todos[idx] = laymansDeepCopy(this.props.todos.updated_todo);
        break;
      }
    }
    if (this.props.projects.selectedMode === "PROJECTS") {
      this.fetchTodos();
    }
    this.setState({ saving: false });

    this.onClickCloseModal(true);
  };

  saveEditedTodo = async () => {
    if (!deepCompare(this.state.selectedTodo, this.state.editedTodo)) {
      await this.addNonExistingProjects();
      await this._saveEditedTodo();
    } else {
      this.onClickCloseModal(false);
    }
  };

  _archiveTodo = async (todoid, archived) => {
    this.setState({ archiving: true });
    await this.props.archiveTodo({
      userid: this.props.auth.user.id,
      todoid,
      archived: !archived,
    });
    this.setState({ archiving: false });
    this.onClickCloseModal();
  };

  onClickArchiveTodo = async () => {
    await this._archiveTodo(
      this.state.selectedTodo._id,
      this.state.selectedTodo.archived
    );
  };

  renderDeadlineEditor(deadline, deadlineEditorOpen) {
    if (deadlineEditorOpen) {
      if (deadline) {
        return (
          <>
            {moment(deadline).format("DD MMM YYYY")}

            <div className="edit-indicator">
              <Edit2 />
            </div>
          </>
        );
      } else {
        return (
          <>
            {"No deadline assigned"}
            <div className="edit-indicator">
              <Edit2 />
            </div>
          </>
        );
      }
    } else {
      if (deadline) {
        let diff = getDiffDays(deadline, moment());
        let date = moment(deadline).format("DD MMM YYYY");
        if (this.state.selectedTodo.status === 2) {
          if (diff < 0) {
            return `${date} (Completed ${getFormattedDiffDay(
              moment(),
              deadline
            )} ago)`;
          } else {
            return `${date} (${getFormattedDiffDay(
              deadline,
              moment()
            )} remain)`;
          }
        } else {
          if (diff < 0) {
            return `${date} (Due by ${getFormattedDiffDay(
              moment(),
              deadline
            )})`;
          } else {
            return `${date} (${getFormattedDiffDay(
              deadline,
              moment()
            )} remain)`;
          }
        }
      } else {
        return "No deadline assigned";
      }
    }
  }

  renderStatusEditor(status) {
    const { statusEditorOpen } = this.state;
    if (!statusEditorOpen) {
      return (
        <div className="status-preset">
          {status === 0 && (
            <div className="status">
              <Circle className="todo" />
              Todo
            </div>
          )}
          {status === 1 && (
            <div className="status">
              <PlayCircle className="doing" />
              Doing
            </div>
          )}
          {status === 2 && (
            <div className="status">
              <CheckCircle className="done" />
              Done
            </div>
          )}
        </div>
      );
    } else {
      let status = this.state.editedTodo.status;
      return (
        <div className="status-editor">
          <div className="buttons has-addons">
            <button
              className={"button todo " + (status === 0 ? "is-selected" : "")}
              onClick={(e) => this.changeStatus(e, 0)}
            >
              <span className="icon is-small">
                <Circle />
              </span>
              <span>Todo</span>
            </button>
            <button
              className={"button doing " + (status === 1 ? "is-selected" : "")}
              onClick={(e) => this.changeStatus(e, 1)}
            >
              <span className="icon is-small">
                <PlayCircle />
              </span>
              <span>Doing</span>
            </button>
            <button
              className={"button done " + (status === 2 ? "is-selected" : "")}
              onClick={(e) => this.changeStatus(e, 2)}
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
  }

  render() {
    const { edit_todo } = this.props.todos;
    const { selectedTodo, editedTodo } = this.state;
    let minDate = new Date(selectedTodo.creation_date);
    return (
      <div
        className="edit-todo"
        style={{ display: edit_todo.modal_open ? "block" : "none" }}
      >
        <div className="edit-todo__overlay">
          <div className="edit-todo__content">
            <div className="edit-icon">
              <Edit />
            </div>
            <div className="top-bar">
              <div className="title">Edit Task</div>
              <div className="push-right">
                <button
                  className={
                    "button delete-todo " +
                    (this.state.deleting ? "is-loading" : "")
                  }
                  onClick={(e) => this._deleteTodo()}
                >
                  {!this.state.deleting && <Trash2 />}
                  Delete
                </button>
                <button
                  className={
                    "button archive-todo " +
                    (this.state.archiving ? "is-loading" : "")
                  }
                  onClick={(e) => this.onClickArchiveTodo(e)}
                >
                  {!this.state.archiving && <Archive />}
                  Archive
                </button>
                <div className="close-button">
                  <XCircle onClick={(e) => this.onClickCloseModal(e)} />
                </div>
              </div>
            </div>

            <div className="content">
              <div className="task" id="edit-input">
                {Object.keys(this.state.selectedTodo).length && (
                  <TextInput
                    Component="input"
                    trigger={this.checkTrigger()}
                    placeholder="Edit Todo"
                    onChange={(val) => this.onEditTask(val)}
                    value={editedTodo.task}
                    options={this.state.projectNames}
                  />
                )}
              </div>
              {Object.keys(this.state.selectedTodo).length && (
                <div className="options">
                  <div className="option date-added columns">
                    <div className="title column is-4">
                      <Star />
                      <span>Date Added</span>
                    </div>
                    <div className="column">
                      {moment(selectedTodo.creation_date).format("DD MMM YYYY")}
                    </div>
                  </div>
                  {selectedTodo.done_date && (
                    <div className="option date-completed columns">
                      <div className="title column is-4">
                        <Award />
                        <span>Date Completed</span>
                      </div>
                      <div className="column">
                        {moment(selectedTodo.done_date).format("DD MMM YYYY") +
                          " (Completed in " +
                          getFormattedDiffDay(
                            selectedTodo.done_date,
                            selectedTodo.creation_date
                          ) +
                          ")"}
                      </div>
                    </div>
                  )}
                  <div className="option deadline columns">
                    <div className="title column is-4">
                      <Cal />
                      <span>Deadline</span>
                    </div>
                    <div
                      className="column"
                      onMouseEnter={() =>
                        this.setState({ deadlineEditorOpen: true })
                      }
                      onMouseLeave={() =>
                        this.setState({
                          deadlineEditorOpen: false,
                          calendarOpen: false,
                        })
                      }
                      onClick={() => {
                        this.setState({
                          calendarOpen: !this.state.calendarOpen,
                        });
                      }}
                    >
                      {this.renderDeadlineEditor(
                        editedTodo.deadline,
                        this.state.deadlineEditorOpen
                      )}
                      <div
                        className="calender-select"
                        style={{
                          display: this.state.calendarOpen ? "block" : "none",
                        }}
                      >
                        <Calendar
                          onChange={(date) => this.editDeadline(date)}
                          minDate={
                            new Date(
                              minDate.getFullYear(),
                              minDate.getMonth(),
                              minDate.getDate()
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="option tags columns"
                    title="Add tags by typing # in your task"
                  >
                    <div className="title column is-4">
                      <Hash />
                      <span>Tags</span>
                    </div>
                    <div className="column">
                      {selectedTodo.projects.length === 0 ? (
                        "No linked tags"
                      ) : (
                        <div className="linked-tags">
                          {editedTodo.projects.map((project) => {
                            return (
                              <span className="tag">{project.projectname}</span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="option status columns">
                    <div className="title column is-4">
                      <Activity />
                      <span>Status</span>
                    </div>
                    <div
                      className="column"
                      onMouseEnter={() =>
                        this.setState({ statusEditorOpen: true })
                      }
                      onMouseLeave={() =>
                        this.setState({
                          statusEditorOpen: false,
                        })
                      }
                    >
                      {this.renderStatusEditor(editedTodo.status)}
                    </div>
                  </div>
                  <div className="option notes columns">
                    <div className="title column is-4">
                      <Edit3 />
                      <span>Notes</span>
                    </div>
                    <div className="column">
                      <textarea
                        value={editedTodo.notes}
                        onChange={(e) => this.onChangeNotes(e)}
                        placeholder={"Add some related notes here"}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="edit-cta">
              <button
                className="button cancel"
                onClick={(e) => this.onClickCloseModal(e)}
              >
                <X />
                Cancel
              </button>
              <button
                className={
                  "button save " + (this.state.saving ? "is-loading" : "")
                }
                onClick={(e) => this.saveEditedTodo(e)}
              >
                {!this.state.saving && <Check />}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  toggleModal,
  editTodo,
  addProject,
  getTodos,
  archiveTodo,
  deleteTodo,
})(EditTodo);
