import axios from "axios";
import { getPath } from "../utils/getPath";
import { ADD_TODO, GET_ERRORS, GET_TODOS, SET_TODO_STATUS } from "./types";

export const addTodo = (todo) => async (dispatch) => {
  var config = {
    withCredentials: true,
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

export const getTodos = (userData) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/todos/gettodos"), userData, config)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: GET_TODOS,
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

export const setStatus = (todo) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  await axios
    .post(getPath("/api/todos/setstatus"), todo, config)
    .then((res) => {
      dispatch({
        type: SET_TODO_STATUS,
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

export const getTodosByDate = (data) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  dispatch({
    type: GET_TODOS,
    payload: [],
    fetching: true,
  });

  await axios
    .post(getPath("/api/todos/gettodosbydate"), data, config)
    .then((res) => {
      dispatch({
        type: GET_TODOS,
        payload: res.data.message,
        fetching: false,
      });
    })
    .catch((err) => {
      if (typeof err.response === "object") {
        dispatch({
          type: GET_ERRORS,
          payload: {
            message: err.response.data.message,
            timestamp: Date.now(),
            fetching: false,
          },
        });
      } else {
        console.log(err);
      }
    });
};

export const getUntrackedTodos = (data) => async (dispatch) => {
  var config = {
    withCredentials: true,
    headers: {
      "x-access-token": localStorage.getItem("JWT"),
      "Content-Type": "application/json",
    },
  };

  dispatch({
    type: GET_TODOS,
    payload: [],
    fetching: true,
  });

  await axios
    .post(getPath("/api/todos/getuntrackedtodos"), data, config)
    .then((res) => {
      dispatch({
        type: GET_TODOS,
        payload: res.data.message,
        fetching: false,
      });
    })
    .catch((err) => {
      if (typeof err.response === "object") {
        dispatch({
          type: GET_ERRORS,
          payload: {
            message: err.response.data.message,
            timestamp: Date.now(),
            fetching: false,
          },
        });
      } else {
        console.log(err);
      }
    });
};
