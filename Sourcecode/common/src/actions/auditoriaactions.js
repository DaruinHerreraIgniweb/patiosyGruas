import {
    FETCH_AUDITORIAS,
    FETCH_AUDITORIAS_SUCCESS,
    FETCH_AUDITORIAS_FAILED,
    EDIT_AUDITORIAS
  } from "../store/types";
import { firebase } from '../config/configureFirebase';
import { onValue, push, set, remove } from "firebase/database";

export const fetchAuditorias = () => (dispatch) => {
    const {
      auditoriaRef      
    } = firebase;
  
    dispatch({
      type: FETCH_AUDITORIAS,
      payload: null
    });
    onValue(auditoriaRef, snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_AUDITORIAS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({ 
          type: FETCH_AUDITORIAS_FAILED,
          payload: "No hay auditorias."
        });
      }
    });
  };

  export const editAuditoria = (auditoria, method) => (dispatch) => {
    const {
      auditoriaRef, 
      auditoriaEditRef
    } = firebase;
    dispatch({
      type: EDIT_AUDITORIAS,
      payload: { method, auditoria }
    });
    if (method === 'Add') {
      push(auditoriaRef, auditoria);
    } else if (method === 'Delete') {
      remove(auditoriaEditRef(auditoria.id));
    } else {
      set(auditoriaEditRef(auditoria.id),auditoria);
    }
  }