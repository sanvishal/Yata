import {
  ADD_TODO,
  GET_TODOS,
  SET_TODO_STATUS,
  SET_MODAL_VISIBILITY,
  EDIT_TODO,
  DELETED_TODO,
} from "../actions/types";

let initialState = {
  new_todo: {},
  todos: [],
  updated_todo: {},
  fetching: false,
  edit_todo: { modal_open: false, id: "", refetch: false },
  deleted_todo: "",
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
        fetching: action.fetching,
      };
    case SET_TODO_STATUS:
      return {
        ...state,
        updated_todo: action.payload,
      };

    case SET_MODAL_VISIBILITY:
      return {
        ...state,
        edit_todo: action.payload,
      };

    case EDIT_TODO:
      return {
        ...state,
        updated_todo: action.payload,
        fetching: action.fetching,
      };
    case DELETED_TODO:
      return {
        ...state,
        deleted_todo: action.payload,
      };
    default:
      return state;
  }
}
