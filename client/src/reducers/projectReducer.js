import { ADD_PROJECT, PROJECT_LIST, SELECTED_PROJECT } from "../actions/types";

let initialState = {
  new_project: {},
  projects: [],
  selectedProject: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_PROJECT:
      console.log(action.payload);
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
    default:
      return state;
  }
}
