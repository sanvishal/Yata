import axios from "axios";
import { getPath } from "../utils/getPath";
import { ADD_PROJECT, GET_ERRORS } from "./types";

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
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response,
      })
    );
};
