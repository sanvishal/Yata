import React, { Component } from "react";
import { Link } from "react-router-dom";
import LandingImg from "../../assets/landingimg.png";
import Inst1 from "../../assets/inst1.png";
import Inst2 from "../../assets/inst2.png";
import Logo from "../../assets/logo.png";

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="header">
          <img className="logo" src={Logo} alt="simplest logo ever made"></img>
          <img
            className="landing-img"
            src={LandingImg}
            alt="Landing Image"
          ></img>
          <div className="nutshell">
            A todo app that works based on{" "}
            <span title="like you know? hashtags on every other social media">
              #hashtags
            </span>
          </div>
        </div>
        <div className="instructions">
          <div className="inst-img">
            <img src={Inst1} alt="first one"></img>
          </div>
          <div className="inst-img">
            <img src={Inst2} alt="second one"></img>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
