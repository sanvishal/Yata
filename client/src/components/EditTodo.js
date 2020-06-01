import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { XCircle, Edit, Calendar as Cal, Calendar } from "react-feather";
import { toggleModal } from "../actions/todoActions";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";

const laymansDeepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

class EditTodo extends Component {
  state = {
    taskEditorOpen: false,
    selectedTodo: {},
    editedTodo: {},
    projectNames: [],
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.todos.edit_todo !== this.props.todos.edit_todo &&
      this.props.todos.edit_todo.modal_open
    ) {
      let todos = this.props.todos.todos;
      const { id } = this.props.todos.edit_todo;
      console.log(this.editInput);
      todos.forEach((todo) => {
        if (todo._id === id) {
          this.setState({
            selectedTodo: laymansDeepCopy(todo),
            editedTodo: laymansDeepCopy(todo),
          });
          return;
        }
      });
    }

    if (prevProps.projects.projects !== this.props.projects.projects) {
      let projectNames = [];
      this.props.projects.projects.forEach((project) => {
        projectNames.push(project.projectname);
      });
      this.setState({ projectNames });
    }
  }

  onClickCloseModal(e) {
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
        });
      }
    );
  }

  onEditTask(val) {
    let editedTodo = this.state.editedTodo;
    editedTodo.task = val;
    this.setState({ editedTodo });
  }

  checkTrigger() {
    return this.state.editedTodo.task.length ? " #" : "#";
  }

  render() {
    const { edit_todo } = this.props.todos;
    const { selectedTodo, editedTodo } = this.state;
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
              <div className="close-button">
                <XCircle onClick={(e) => this.onClickCloseModal(e)} />
              </div>
            </div>

            <div className="content">
              <div className="task">
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
              <div className="options">
                <div className="option deadline columns">
                  <div className="title column is-3">
                    <Cal />
                    <span>Deadline</span>
                  </div>
                  <div className="deadline-date column is-9">
                    {selectedTodo.deadline && "No deadline assigned"}
                  </div>
                </div>
                <div className="option tags columns">
                  <div className="title column is-3">
                    <Cal />
                    <span>Tags</span>
                  </div>
                  <div className="deadline-date column is-9">
                    {selectedTodo.deadline && "No deadline assigned"}
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps, { toggleModal })(EditTodo);
