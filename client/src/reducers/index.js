import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import projectReducer from "./projectReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  projects: projectReducer,
});
