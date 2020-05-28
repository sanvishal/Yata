import {
  ADD_TODO,
  GET_TODOS,
  SET_TODO_STATUS,
  GET_TODOS_BY_DATE,
} from "../actions/types";

let initialState = {
  new_todo: {},
  todos: [],
  updated_todo: {},
  todos_by_date: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        new_todo: action.payload,
      };
    case GET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    case SET_TODO_STATUS:
      return {
        ...state,
        updated_todo: action.payload,
      };
    case GET_TODOS_BY_DATE:
      return {
        ...state,
        todos_by_date: action.payload,
      };
    default:
      return state;
  }
}
