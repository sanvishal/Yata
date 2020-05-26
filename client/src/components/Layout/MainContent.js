import React, { Component } from "react";
import AddTodo from "../AddTodo";
import { connect } from "react-redux";
import Todo from "../Todo";
import { getTodos } from "../../actions/todoActions";
import { getProgress } from "../../actions/projectActions";
import ProjectProgress from "../ProjectProgress";
import moment from "moment";
import { ChevronDown } from "react-feather";

class MainContent extends Component {
  state = {
    loading: false,
    completion: 0,
    dueTodos: [],
    todayTodos: [],
    upcomingTodos: [],
    dueOpen: true,
    todayOpen: true,
    upcomingOpen: true,
  };

  fetchTodos = async () => {
    await this.props.getTodos({
      id: this.props.auth.user.id,
      projectid: this.props.projects.selectedProject.id,
    });
    await this.fetchProgress();
  };

  fetchProgress = async () => {
    await getProgress(
      {
        id: this.props.auth.user.id,
        projectid: this.props.projects.selectedProject.id,
      },
      (res) => {
        this.getPercentageCompletion(res.data.message[0].done);
      }
    );
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.projects.selectedProject !== this.props.projects.selectedProject
    ) {
      if (Object.keys(this.props.projects.selectedProject).length) {
        this.fetchTodos();
      }
    }

    if (prevProps.todos.updated_todo !== this.props.todos.updated_todo) {
      if (Object.keys(this.props.todos.updated_todo).length) {
        this.fetchProgress();
      }
    }

    if (prevProps.todos.todos !== this.props.todos.todos) {
      if (this.props.todos.todos.length) {
        this.seperateTodosByDate();
      }
    }
  }

  getPercentageCompletion(completed) {
    this.setState({
      completion:
        completed !== 0 ? completed / this.props.todos.todos.length : 0,
    });
  }

  seperateTodosByDate() {
    let todayTodos = [],
      dueTodos = [],
      upcomingTodos = [];
    const { todos } = this.props.todos;
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
    this.setState(
      {
        todayTodos,
        dueTodos,
        upcomingTodos,
      },
      () => {
        console.log(this.state);
      }
    );
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
          <div>{selectedMode}</div>
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

export default connect(mapStateToProps, { getTodos })(MainContent);
