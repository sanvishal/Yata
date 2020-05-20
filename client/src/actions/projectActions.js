import axios from "axios";
import isEmpty from "is-empty";
import { getPath } from "../utils/getPath";
import {
  ADD_PROJECT,
  GET_ERRORS,
  PROJECT_LIST,
  SELECTED_PROJECT,
} from "./types";

export const addProject = (projectData) => async (dispatch) => {
  var config = {
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/projects/addproject"), projectData, config)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ADD_PROJECT,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: { message: err.response.data.message, timestamp: Date.now() },
      });
    });
};

export const fetchProjects = (userdata) => async (dispatch) => {
  var config = {
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/projects/getprojects"), userdata, config)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: PROJECT_LIST,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: { message: err.response.data.message, timestamp: Date.now() },
      });
    });
};

export const setProject = (project) => (dispatch) => {
  if (!isEmpty(project)) {
    dispatch({
      type: SELECTED_PROJECT,
      payload: project,
    });
  }
};
