import {
    FETCH_PATIOS,
    FETCH_PATIOS_SUCCESS,
    FETCH_PATIOS_FAILED,
    EDIT_PATIOS,
  } from "../store/types";
  
  export const INITIAL_STATE = {
    patios: null,
    loading: false,
    error: {
      flag: false,
      msg: null,
    },
  };
  
  export const patiosreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_PATIOS:
        return {
          ...state,
          loading: true,
        };
      case FETCH_PATIOS_SUCCESS:
        return {
          ...state,
          patios: action.payload,
          loading: false,
        };
      case FETCH_PATIOS_FAILED:
        return {
          ...state,
          patios: null,
          loading: false,
          error: {
            flag: true,
            msg: action.payload,
          },
        };
      case EDIT_PATIOS:
        return state;
      default:
        return state;
    }
  };
  