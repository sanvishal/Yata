import axios from "axios";
import isEmpty from "is-empty";
import { getPath } from "../utils/getPath";
import {
  ADD_PROJECT,
  GET_ERRORS,
  PROJECT_LIST,
  SELECTED_PROJECT,
  SELECTED_MODE,
  GET_TODOS,
} from "./types";

export const addProject = (projectData) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/projects/addproject"), projectData, config)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: ADD_PROJECT,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      if (typeof err === "object") {
        dispatch({
          type: GET_ERRORS,
          payload: {
            message: err.response.data.message,
            timestamp: Date.now(),
          },
        });
      } else {
        console.log(err);
      }
    });
};

export const fetchProjects = (userdata) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("JWT"),
    },
  };

  await axios
    .post(getPath("/api/projects/getprojects"), userdata, config)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: PROJECT_LIST,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      if (typeof err.response === "object") {
        dispatch({
          type: GET_ERRORS,
          payload: {
            message: err.response.data.message,
            timestamp: Date.now(),
          },
        });
      } else {
        console.log(err);
      }
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

export const setMode = (mode) => (dispatch) => {
  if (!isEmpty(mode)) {
    dispatch({
      type: SELECTED_MODE,
      payload: mode,
    });
    dispatch({
      type: SELECTED_PROJECT,
      payload: {},
    });
  }
};

export const getProgress = async (data, done) => {
  var config = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("JWT"),
    },
  };

  await axios
    .post(getPath("/api/projects/getprogress"), data, config)
    .then((res) => {
      // console.log(res.data);
      return done(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
