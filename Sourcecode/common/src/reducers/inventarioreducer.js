import {
    FETCH_INVENTARIOS,
    FETCH_INVENTARIOS_SUCCESS,
    FETCH_INVENTARIOS_FAILED
  } from "../store/types";
  
  export const INITIAL_STATE = {
    inventarios: null,
    loading: false,
    error: {
      flag: false,
      msg: null,
    },
  };
  
  export const inventarioreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_INVENTARIOS:
        return {
          ...state,
          loading: true,
        };
      case FETCH_INVENTARIOS_SUCCESS:
        return {
          ...state,
          inventarios: action.payload,
          loading: false,
        };
      case FETCH_INVENTARIOS_FAILED:
        return {
          ...state,
          inventarios: null,
          loading: false,
          error: {
            flag: true,
            msg: action.payload,
          },
        };
      default:
        return state;
    }
  };
  