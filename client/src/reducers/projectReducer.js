import { ADD_PROJECT } from "../actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_PROJECT:
      return {
        ...state,
        projects: action.payload,
      };
    default:
      return state;
  }
}
