import {
    FETCH_PATIOS,
    FETCH_PATIOS_SUCCESS,
    FETCH_PATIOS_FAILED,
    EDIT_PATIOS
  } from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue, push, set, remove } from "firebase/database";

export const fetchPatios = () => (dispatch) => {
    const {
      patioRef
    } = firebase;
  
    dispatch({
      type: FETCH_PATIOS,
      payload: null
    });
    onValue(patioRef, snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_PATIOS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_PATIOS_FAILED,
          payload: "No patios available."
        });
      }
    });
  };

export const editPatio = (patio, method) => (dispatch) => {
    const {
      patioRef, 
      patioEditRef
    } = firebase;
    dispatch({
      type: EDIT_PATIOS,
      payload: { method, patio }
    });
    if (method === 'Add') {
      push(patioRef, patio);
    } else if (method === 'Delete') {
      remove(patioEditRef(patio.id));
    } else {
      set(patioEditRef(patio.id),patio);
    }
  }