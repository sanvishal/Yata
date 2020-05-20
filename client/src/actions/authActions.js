import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { getPath } from "../utils/getPath";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post(getPath("/api/users/register"), userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.message,
      })
    );
};

export const loginUser = (userData) => (dispatch) => {
  axios
    .post(getPath("/api/users/login"), userData)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("JWT", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      console.log(err.response);
      dispatch({
        type: GET_ERRORS,
        payload:
          typeof err.response.data.message === "string"
            ? {
                message: err.response.data.message,
                timestamp: Date.now(),
                toast: true,
              }
            : err.response.data.message,
      });
    });
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("JWT");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
