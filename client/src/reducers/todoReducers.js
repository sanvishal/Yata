import { ADD_TODO } from "../actions/types";

let initialState = {
  new_todo: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        new_todo: action.payload,
      };
    default:
      return state;
  }
}
