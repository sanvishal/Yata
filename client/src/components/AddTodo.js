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
import moment from "moment";
import "react-calendar/dist/Calendar.css";

function extractProjects(str) {
  let splitStr = str.split(" ");
  return splitStr.filter((x) => x.startsWith("#") && x.length > 1, splitStr);
}

function padDigits(number, digits) {
  return (
    Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
  );
}

function fixTimeAccuracy(date) {
  let splitDate = date.toString().split(" ");
  var d = new Date();
  let hours = padDigits(d.getHours(), 2),
    minutes = padDigits(d.getMinutes(), 2),
    seconds = padDigits(d.getSeconds(), 2);
  splitDate[4] = hours + ":" + minutes + ":" + seconds;
  return new Date(splitDate.join(" "));
}

function removeItemAll(arr, value) {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

class AddTodo extends Component {
  state = {
    isOpen: false,
    task: "",
    deadline: "",
    status: 0,
    notes: "",
    projects: {},
    statusOpen: false,
    calendarOpen: false,
    difference: "",
    linkedProjects: [],
  };

  toggleStatus(e) {
    this.setState({ statusOpen: !this.state.statusOpen });
  }

  onChangeTask(e) {
    console.log(this.state.projects);
    let projects = extractProjects(e.target.value),
      newProjects = {},
      linkedProjects = [];

    this.props.projects.projects.forEach((project) => {
      if (projects.includes("#" + project.projectname)) {
        newProjects["#" + project.projectname] = project.color;
        projects = removeItemAll(projects, "#" + project.projectname);
        linkedProjects.push({
          projectname: project.projectname,
          id: project.id,
        });
      }
    });

    projects.forEach((project) => {
      newProjects[project] = "#ffffff";
      linkedProjects.push({
        projectname: project.projectname,
        id: "",
      });
    });
    this.setState({
      task: e.target.value,
      projects: newProjects,
      linkedProjects,
    });
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedProject !== this.props.projects.selectedProject
    ) {
      let project = {};
      const { selectedProject } = this.props.projects;
      project["#" + selectedProject.projectname] = selectedProject.color;
      this.setState({
        projects: project,
        task: "#" + selectedProject.projectname,
        linkedProjects: [
          {
            projectname: selectedProject.projectname,
            id: selectedProject.id,
          },
        ],
      });
    }
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

  onChangeDate(date) {
    let selectedDate = fixTimeAccuracy(new Date(date));
    this.setState({ deadline: selectedDate.toISOString() });
    let today = moment();
    let target = moment(selectedDate).endOf("day");
    let diff = target.diff(today, "days");
    switch (diff) {
      case 0:
        this.setState({
          difference: "by " + target.diff(today, "hours") + " hours",
        });
        break;
      case 1:
        this.setState({ difference: "Tomorrow" });
        break;
      case 2:
        this.setState({ difference: "Day after Tomorrow" });
        break;
      default:
        this.setState({ difference: "by " + diff + " days" });
        break;
    }
  }

  toggleCalender(e) {
    this.setState({ calendarOpen: !this.state.calendarOpen });
  }

  render() {
    return (
      <div className="todo-container">
        {Object.keys(this.state.projects).length ? (
          <div className="projects-accumulator">
            {Object.keys(this.state.projects).map((project) => {
              return (
                <div
                  className="project-badge"
                  style={{
                    backgroundColor: this.state.projects[project] + "10",
                    color: this.state.projects[project] + "EE",
                  }}
                >
                  {project}
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
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
              value={this.state.task}
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
            {this.state.deadline ? (
              <span>{this.state.difference}</span>
            ) : (
              <span>Set Deadline</span>
            )}
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
