import {
    FETCH_AUDITORIAS,
    FETCH_AUDITORIAS_SUCCESS,
    FETCH_AUDITORIAS_FAILED
  } from "../store/types";
  
  export const INITIAL_STATE = {
    auditorias: null,
    loading: false,
    error: {
      flag: false,
      msg: null,
    },
  };
  
  export const auditoriareducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case FETCH_AUDITORIAS:
        return {
          ...state,
          loading: true,
        };
      case FETCH_AUDITORIAS_SUCCESS:
        return {
          ...state,
          auditorias: action.payload,
          loading: false,
        };
      case FETCH_AUDITORIAS_FAILED:
        return {
          ...state,
          auditorias: null,
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
  