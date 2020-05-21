import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import projectReducer from "./projectReducer";
import todoReducer from "./todoReducers";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  projects: projectReducer,
  todos: todoReducer,
});
