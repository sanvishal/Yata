import React, { Component } from "react";
import { connect } from "react-redux";
import { getDashboard } from "../../actions/todoActions";
import Toast from "./../ToastNotification";
import {
  PlayCircle,
  CheckCircle,
  Circle,
  Globe,
  Star,
  Heart,
  Hash,
} from "react-feather";
import { setProject, setMode } from "../../actions/projectActions";

const greetUser = (uname) => {
  let today = new Date();
  let currhours = today.getHours();

  if (currhours < 12) {
    return "Good Morning " + uname;
  } else if (currhours < 18) {
    return "Good Afternoon " + uname;
  } else {
    return "Good Evening " + uname;
  }
};

class Dashboard extends Component {
  state = {
    todoStats: {},
    frequentProjects: [],
    todayTodoStats: {},
    loading: true,
  };

  fetchDashboard = async (userid) => {
    this.setState({ loading: true });
    await getDashboard(
      {
        userid,
      },
      (result) => {
        if (result) {
          if (result.status === "success") {
            this.setState({
              todoStats: result.message.todoStats,
              frequentProjects: result.message.frequentProjects,
              todayTodoStats: result.message.todayTodoStats,
            });
          } else {
            Toast.fire({
              title: "Internal server error ;_;",
            });
          }
        }
      }
    );
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.fetchDashboard(this.props.auth.user.id);
  }

  // changeProject(project) {
  //   console.log(project);
  //   this.props.setProject(project);
  // }

  renderTodoStats() {
    const { todoStats } = this.state;
    if (Object.keys(todoStats).length) {
      let todo = todoStats.todo.length ? todoStats.todo[0].todo : 0,
        doing = todoStats.doing.length ? todoStats.doing[0].doing : 0,
        done = todoStats.done.length ? todoStats.done[0].done : 0;

      return (
        <div className="todo-stats-container">
          <div className="todo-stats">
            <div className="stat-title">
              Everything <Globe />
            </div>
            <StatCard
              type="Todos"
              data={todo}
              color={"#aeaeae"}
              animdelay={0.26}
            ></StatCard>
            <StatCard
              type="Doing"
              data={doing}
              color={"#ffbc26"}
              animdelay={0.33}
            ></StatCard>
            <StatCard
              type="Done"
              data={done}
              color={"#adff2f"}
              animdelay={0.4}
            ></StatCard>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }

  renderTodayTodoStats() {
    const { todayTodoStats } = this.state;
    if (Object.keys(todayTodoStats).length) {
      let todo = todayTodoStats.todo.length ? todayTodoStats.todo[0].todo : 0,
        doing = todayTodoStats.doing.length ? todayTodoStats.doing[0].doing : 0,
        done = todayTodoStats.done.length ? todayTodoStats.done[0].done : 0;
      return (
        <div className="todo-stats-container">
          <div className="todo-stats">
            <div className="stat-title">
              Today <Star />
            </div>
            <StatCard
              type="Todos"
              data={todo}
              color={"#aeaeae"}
              animdelay={0.05}
            ></StatCard>
            <StatCard
              type="Doing"
              data={doing}
              color={"#ffbc26"}
              animdelay={0.12}
            ></StatCard>
            <StatCard
              type="Done"
              data={done}
              color={"#adff2f"}
              animdelay={0.19}
            ></StatCard>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }

  renderFavoriteProjects() {
    const { frequentProjects } = this.state;
    if (frequentProjects.length) {
      return (
        <div className="todo-stats-container favorite-projects-container">
          <div className="todo-stats">
            <div className="stat-title">
              Favorite tags <Heart />
            </div>
            {frequentProjects.map((project, key) => {
              if (project.project.length) {
                const { projectname, color } = project.project[0];
                return (
                  <StatCard
                    type={"#" + projectname}
                    data={project.count}
                    color={color}
                    projectObj={project.project[0]}
                    animdelay={0.4 + key / 10}
                  />
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="top-header">
          <div className="greet">{greetUser(this.props.auth.user.name)}</div>
          <div className="greet-subtitle">
            Welcome to your workspace, let's get some work done!
          </div>
        </div>
        {this.state.loading ? (
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
        ) : (
          <>
            {this.renderTodayTodoStats()}

            {this.renderTodoStats()}

            {this.renderFavoriteProjects()}
          </>
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

export default connect(mapStateToProps, {})(Dashboard);

const StatCardComp = ({
  type,
  data,
  color,
  projectObj,
  setProject,
  setMode,
  animdelay,
}) => {
  return (
    <div
      className="stat-card fadeInUp"
      style={{ backgroundColor: color + "10", animationDelay: animdelay + "s" }}
      onClick={(e) => {
        projectObj["id"] = projectObj._id;
        setMode("PROJECTS");
        setProject(projectObj);
      }}
    >
      <div className="type" style={{ color: color + "FA" }}>
        {type}
      </div>
      <div className="accent-icon">
        {type === "Todos" && <Circle style={{ color: color }} />}
        {type === "Doing" && <PlayCircle style={{ color: color }} />}
        {type === "Done" && <CheckCircle style={{ color: color }} />}
        {type.startsWith("#") && <Hash style={{ color: color }} />}
      </div>
      <div className="data">{data}</div>
    </div>
  );
};

const StatCard = connect(mapStateToProps, { setProject, setMode })(
  StatCardComp
);
