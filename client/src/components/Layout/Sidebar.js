import React, { Component } from "react";
import {
  Hash,
  Plus,
  Check,
  Home,
  Star,
  Clock,
  Coffee,
  List,
} from "react-feather";
import { connect } from "react-redux";
import Toast from "../ToastNotification";
import {
  addProject,
  fetchProjects,
  setProject,
  setMode,
} from "../../actions/projectActions";
import getRandomColor from "../../utils/getRandomColor";

class Sidebar extends Component {
  state = {
    projects: [],
    openCreateProject: false,
    projectname: "",
    color: getRandomColor(),
    loading: false,
    fetching: true,
    currentProject: {},
  };

  _fetchProjects = async () => {
    await this.props.fetchProjects({
      id: this.props.auth.user.id,
    });
    this.setState({ fetching: false });
    if (this.props.projects.projects.length) {
      this.setState({ projects: this.props.projects.projects }, () => {
        if (this.props.projects.selectedMode === "PROJECTS") {
          this.setProject(null, this.state.projects.length - 1);
        }
      });

      //if (changeMode) {
      //this.props.setMode("EVERYTHING");
      //} else {
      //this.setProject(null, 0);
      //}
    } else {
      this.props.setMode("EVERYTHING");
    }
  };

  componentDidMount() {
    this._fetchProjects();
  }

  setProject(e, idx) {
    this.props.setMode("PROJECTS");
    this.setState({ currentProject: this.state.projects[+idx] });
    this.props.setProject(this.state.projects[+idx]);
  }

  toggleCreateProject = (e) => {
    this.setState({
      openCreateProject: !this.state.openCreateProject,
      color: getRandomColor(),
      projectname: "",
    });
  };

  changeColor = (e) => {
    this.setState({ color: getRandomColor() });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.projects.new_project !== this.props.projects.new_project) {
      this._fetchProjects();
    }

    if (
      prevProps.projects.deleted_project !== this.props.projects.deleted_project
    ) {
      if (this.props.projects.deleted_project.length) {
        this._fetchProjects();
      }
    }
  }

  createProject = async (e) => {
    if (this.state.projectname) {
      if (this.state.loading) {
        Toast.fire({
          title: "Patience is key :)",
        });
        return;
      }
      this.setState({ loading: true });
      await this.props.addProject({
        id: this.props.auth.user.id,
        projectname: this.state.projectname,
        color: this.state.color,
      });
      if (Object.keys(this.props.projects.new_project).length) {
        let newProjects = [
          ...this.state.projects,
          {
            color: this.props.projects.new_project.color,
            projectname: this.props.projects.new_project.projectname,
            id: this.props.projects.new_project._id,
            timestamp: this.props.projects.new_project.date,
          },
        ];
        this.setState({ projects: newProjects, loading: false });
        this.toggleCreateProject();
        return;
      } else {
        Toast.fire({
          title: this.props.errors.message,
        });
        this.setState({ loading: false });
      }
    }
    Toast.fire({
      title: "Enter a valid & unique project name",
    });
  };

  onChangeProjectName = (e) => {
    this.setState({ projectname: e.target.value });
  };

  changeMode(e, mode) {
    this.props.setMode(mode);
    // console.log(this.props.projects);
    this.setState({ currentProject: {} });
  }

  render() {
    const { projects, openCreateProject, projectname, color } = this.state;
    const { selectedMode } = this.props.projects;
    return (
      <div className="sidebar-container">
        <div className="sidebar">
          <div
            className={
              "sidebar__title" +
              (selectedMode === "EVERYTHING" ? " mode__active" : "")
            }
            onClick={(e) => this.changeMode(e, "EVERYTHING")}
          >
            <Home />
            <span>Everything</span>
          </div>
          <div
            className={
              "sidebar__title" +
              (selectedMode === "TODAY" ? " mode__active" : "")
            }
            onClick={(e) => this.changeMode(e, "TODAY")}
          >
            <Star />
            <span>Today</span>
          </div>
          <div
            className={
              "sidebar__title" +
              (selectedMode === "TOMORROW" ? " mode__active" : "")
            }
            onClick={(e) => this.changeMode(e, "TOMORROW")}
          >
            <Clock />
            <span>Tomorrow</span>
          </div>
          <div
            className={
              "sidebar__title" +
              (selectedMode === "UPCOMING" ? " mode__active" : "")
            }
            onClick={(e) => this.changeMode(e, "UPCOMING")}
          >
            <Coffee />
            <span>Upcoming</span>
          </div>
          <div
            className={
              "sidebar__title" +
              (selectedMode === "UNTRACKED" ? " mode__active" : "")
            }
            onClick={(e) => this.changeMode(e, "UNTRACKED")}
          >
            <List />
            <span>Untracked</span>
          </div>
          <div className="sidebar__title">
            <span>Tags</span>
          </div>
          <div className="sidebar__projects-list">
            {projects.length ? (
              projects.map((project, key) => {
                return (
                  <div
                    className={
                      "sidebar__project fadeInLeft" +
                      (this.state.currentProject.id === project.id
                        ? " active"
                        : "")
                    }
                    id={key}
                    style={{
                      borderLeft: "0px solid " + project.color,
                      animationDelay: (key / 20 >= 0.7 ? 0.7 : key / 20) + "s",
                      background:
                        this.state.currentProject.id === project.id
                          ? project.color + "10"
                          : "",
                    }}
                    onClick={(e) => this.setProject(e, key)}
                  >
                    <div
                      className="sidebar__project__icon"
                      style={{ backgroundColor: project.color + "30" }}
                    >
                      <Hash style={{ color: project.color }} />
                    </div>
                    <div className="sidebar__project__project-name">
                      {project.projectname}
                    </div>
                  </div>
                );
              })
            ) : !this.state.fetching ? (
              <div
                className="sidebar__no-projects"
                style={{
                  display: this.state.openCreateProject ? "none" : "block",
                }}
              >
                No projects :(
                <div className="sidebar__no-projects__create-project">
                  <a className="button">
                    <Plus onClick={(e) => this.toggleCreateProject(e)} />
                  </a>
                </div>{" "}
                a project
              </div>
            ) : (
              <div
                className="loader"
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  border: "2px solid #4c5258",
                  marginTop: "50px",
                  borderRightColor: "transparent",
                  borderTopColor: "transparent",
                }}
              ></div>
            )}
          </div>
          {projects.length || this.state.openCreateProject ? (
            <div
              className="sidebar__create-project-trigger"
              onClick={(e) => this.toggleCreateProject(e)}
              style={{ display: !openCreateProject ? "flex" : "none" }}
            >
              <Plus />
              <span>Create Project</span>
            </div>
          ) : (
            <></>
          )}
          {openCreateProject ? (
            <div className="sidebar__create-project">
              <div className="sidebar__create-project__input">
                <Hash
                  onClick={(e) => this.changeColor(e)}
                  style={{ color: color, backgroundColor: color + "30" }}
                />
                <input
                  disabled={this.state.loading}
                  placeholder="Enter a good project name"
                  onChange={(e) => this.onChangeProjectName(e)}
                ></input>
              </div>

              <div className="sidebar__create-project__close">
                <Plus
                  className="close"
                  style={{ transform: "rotate(45deg)" }}
                  onClick={(e) => this.toggleCreateProject(e)}
                />
                <Check
                  className="done"
                  onClick={(e) => this.createProject(e)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.projects,
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  addProject,
  fetchProjects,
  setProject,
  setMode,
})(Sidebar);
