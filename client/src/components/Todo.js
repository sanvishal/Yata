import React, { Component } from "react";
import { CheckCircle, Circle, PlayCircle } from "react-feather";
import { setStatus } from "../actions/todoActions";
import { connect } from "react-redux";
import Toast from "./ToastNotification";
import Reward from "react-rewards";
import moment from "moment";

class Todo extends Component {
  state = {
    myStatus: this.props.status,
    loading: false,
  };

  _setStatus = async (id, status) => {
    this.setState({ loading: true });
    if (status === 0 || status === 1 || status === 2) {
      await this.props.setStatus({
        id,
        status,
      });
      this.setState({
        //myStatus: this.props.todos.updated_todo.status,
        loading: false,
      });
      if (status === 2 && this.reward) {
        this.reward.rewardMe();
        Toast.fire({
          title:
            "Keep it up " + this.props.auth.user.name + ", you're on a streak!",
          customClass: {
            popup: "swal2-popup__success",
          },
        });
      }
    }
  };

  onClickDone(e, id) {
    if (this.props.status === 2) {
      this._setStatus(id, 0);
    } else {
      this._setStatus(id, 2);
    }
  }

  render() {
    const { task, id, status } = this.props;
    return (
      <div className={"todo-list-container__todo"}>
        <Reward
          ref={(ref) => {
            this.reward = ref;
          }}
          type="confetti"
          config={{
            angle: 360,
            decay: 0.9,
            spread: 360,
            startVelocity: 15,
            elementCount: 20,
            lifetime: 50,
          }}
        >
          {!this.state.loading ? (
            status === 0 ? (
              <>
                <Circle
                  className="todo"
                  onClick={(e) => this.onClickDone(e, id)}
                />
              </>
            ) : status === 1 ? (
              <>
                <PlayCircle
                  className="doing"
                  onClick={(e) => this.onClickDone(e, id)}
                />
              </>
            ) : (
              <>
                <CheckCircle
                  className="done"
                  onClick={(e) => this.onClickDone(e, id)}
                />
              </>
            )
          ) : (
            <div className="loader"></div>
          )}
        </Reward>
        <div className="task">{task}</div>
        {this.props.deadline ? (
          <div className="deadline">
            {moment(this.props.deadline).format("DD MMM")}
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

export default connect(mapStateToProps, { setStatus })(Todo);