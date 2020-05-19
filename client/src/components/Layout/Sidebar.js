import React, { Component } from "react";
import { Hash, Plus, Check } from "react-feather";
import { connect } from "react-redux";
import Toast from "../ToastNotification";
import { addProject } from "../../actions/projectActions";

const getRandomColor = () => {
  let colors = [
    "#FFBC26",
    "#FD413C",
    "#2D9CFC",
    "#ffffff",
    "#6DACCB",
    "#894FC6",
    "#F934A4",
    "#36D9D8",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

class Sidebar extends Component {
  state = {
    projects: [
      {
        color: "#FFBC26",
        projectname: "abced",
      },
      {
        color: "#FD413C",
        projectname: "abjjd",
      },
    ],
    openCreateProject: false,
    projectname: "",
    color: getRandomColor(),
  };

  ap = async (e) => {
    await this.props.addProject();
    console.log(this.props);
  };

  componentDidMount() {
    this.ap(1);
    console.log(this.props);
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

  createProject = async (e) => {
    if (this.state.projectname) {
      await this.props.addProject({
        id: this.props.auth.user.id,
        projectname: this.state.projectname,
        color: this.state.color,
      });
      console.log(this.props);
      let newProjects = [
        ...this.state.projects,
        {
          color: this.state.color,
          projectname: this.state.projectname,
        },
      ];
      this.setState({ projects: newProjects });
      this.toggleCreateProject();
      return;
    }
    Toast.fire({
      title: "Enter a valid project name",
    });
  };

  onChangeProjectName = (e) => {
    this.setState({ projectname: e.target.value });
  };

  render() {
    const { projects, openCreateProject, projectname, color } = this.state;
    return (
      <div className="sidebar-container">
        <div className="sidebar">
          <div className="sidebar__title">Projects</div>
          <div className="sidebar__projects-list">
            {projects.length ? (
              projects.map((project) => {
                return (
                  <div
                    className="sidebar__project"
                    style={{ borderLeft: "0px solid " + project.color }}
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
            ) : (
              <div className="sidebar__no-projects">
                No projects :(
                <div className="sidebar__no-projects__create-project">
                  <a className="button">
                    <Plus />
                  </a>
                </div>{" "}
                a project
              </div>
            )}
          </div>
          {projects.length ? (
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
  projects: state.projects.projects,
  auth: state.auth,
});

export default connect(mapStateToProps, { addProject })(Sidebar);
