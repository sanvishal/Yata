import axios from "axios";
import { getPath } from "../utils/getPath";
import { ADD_TODO, GET_ERRORS } from "./types";

export const addTodo = (todo) => async (dispatch) => {
  var config = {
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/todos/addtodo"), todo, config)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ADD_TODO,
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
