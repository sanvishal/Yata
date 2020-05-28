import {
  ADD_PROJECT,
  PROJECT_LIST,
  SELECTED_PROJECT,
  SELECTED_MODE,
} from "../actions/types";

let initialState = {
  new_project: {},
  projects: [],
  selectedMode: "",
  selectedProject: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_PROJECT:
      return {
        ...state,
        new_project: action.payload,
      };
    case PROJECT_LIST:
      return {
        ...state,
        projects: action.payload,
      };

    case SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: action.payload,
      };

    case SELECTED_MODE:
      return {
        ...state,
        selectedMode: action.payload,
      };
    default:
      return state;
  }
}
