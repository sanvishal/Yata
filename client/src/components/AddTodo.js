import React, { Component } from "react";
import { connect } from "react-redux";
import { addTodo } from "../actions/todoActions";
import onclickoutside from "react-onclickoutside";
import {
  ChevronDown,
  MinusCircle,
  CheckCircle,
  Circle,
  PlayCircle,
  Check,
  Calendar as Cal,
} from "react-feather";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

class AddTodo extends Component {
  state = {
    isOpen: false,
    task: "",
    deadline: "",
    status: 0,
    notes: "",
    projects: [],
    statusOpen: false,
    calendarOpen: false,
  };

  toggleStatus(e) {
    this.setState({ statusOpen: !this.state.statusOpen });
  }

  onChangeTask(e) {
    this.setState({ task: e.target.value });
  }

  toggleOpen(e) {
    this.setState({ isOpen: true, statusOpen: false });
  }

  handleClickOutside() {
    this.setState({ isOpen: false, statusOpen: false });
  }

  setStatus(e, status) {
    this.setState({ status: status });
  }

  onChangeDate(e) {
    console.log(e);
  }

  toggleCalender(e) {
    this.setState({ calendarOpen: !this.state.calendarOpen });
  }

  render() {
    return (
      <div className="todo-container">
        <div className="todo-inputs">
          <div
            className={
              "dropdown select-status" +
              (this.state.statusOpen ? " is-active" : "")
            }
          >
            <button
              className="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              style={{
                width: this.state.isOpen ? "120px" : "",
                opacity: this.state.isOpen ? "1" : "0",
              }}
              onClick={(e) => this.toggleStatus(e)}
            >
              <div className="dropdown-trigger">
                {this.state.status === 0 ? (
                  <>
                    <Circle className="todo" />
                    <div>Todo</div>
                  </>
                ) : this.state.status === 1 ? (
                  <>
                    <PlayCircle className="doing" />
                    <div>Doing</div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="done" />
                    <div>Done</div>
                  </>
                )}

                <ChevronDown />
              </div>
            </button>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <a
                  href="#"
                  className="dropdown-item todo"
                  onClick={(e) => this.setStatus(e, 0)}
                >
                  <Circle />
                  Todo
                </a>
                <a
                  href="#"
                  className="dropdown-item doing"
                  onClick={(e) => this.setStatus(e, 1)}
                >
                  <PlayCircle />
                  Doing
                </a>
                <a
                  href="#"
                  className="dropdown-item done"
                  onClick={(e) => this.setStatus(e, 2)}
                >
                  <CheckCircle />
                  Done
                </a>
              </div>
            </div>
          </div>
          <div className="control todo-input">
            <input
              className="input"
              type="text"
              placeholder="Add a todo"
              onChange={(e) => this.onChangeTask(e)}
              onClick={(e) => this.toggleOpen(e)}
            />
          </div>
        </div>
        <div
          className="todo-buttons"
          style={{
            marginTop: this.state.isOpen ? "0px" : "-40px",
          }}
        >
          <div
            className="todo-buttons__deadline"
            onClick={(e) => this.toggleCalender(e)}
          >
            <Cal />
          </div>
          <div className="todo-buttons__add-todo">
            <span>Add</span>
            <Check />
          </div>
        </div>
        {this.state.calendarOpen ? (
          <div className="calender-select">
            <Calendar onChange={(date) => this.onChangeDate(date)} />
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  todos: state.todos,
  auth: state.auth,
});

export default connect(mapStateToProps, { addTodo })(onclickoutside(AddTodo));
