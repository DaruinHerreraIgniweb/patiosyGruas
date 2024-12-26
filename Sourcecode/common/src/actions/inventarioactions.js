import {
    FETCH_INVENTARIOS,
    FETCH_INVENTARIOS_SUCCESS,
    FETCH_INVENTARIOS_FAILED,
    EDIT_INVENTARIOS
  } from "../store/types";
  import { firebase } from '../config/configureFirebase';
  import { onValue, push, set, remove } from "firebase/database";
  import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

  
  export const fetchInventarios = () => (dispatch) => {
  
    const {
      inventarioRef
    } = firebase;
  
    dispatch({
      type: FETCH_INVENTARIOS,
      payload: null
    });
    onValue(inventarioRef, snapshot => {
      if (snapshot.val()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(i => {
          data[i].id = i;
          return data[i]
        });
        dispatch({
          type: FETCH_INVENTARIOS_SUCCESS,
          payload: arr
        });
      } else {
        dispatch({
          type: FETCH_INVENTARIOS_FAILED,
          payload: "No hay inventario."
        });
      }
    });
  };

  export const updateNewDocument = (inventario, documentBlob, inventorySaved) => async(dispatch) => {
    const {
      inventarioEditRef,
      extraDocumentRef
    } = firebase;

    // ACA SE CAMBIA EL NOMBRE DEL ARCHIVO NUEVO QUE SE SUBE
    const fileName = `Inventario_NUEVO_DOCUMENTO}.xlsx`;
    await uploadBytesResumable(extraDocumentRef(inventorySaved.patio_id, inventario.id, fileName), documentBlob);
    let doc = await getDownloadURL(extraDocumentRef(inventorySaved.patio_id, inventario.id, fileName));
  
    let index = inventorySaved.inventory.findIndex(inv => inv.id == inventario.id);
    inventorySaved.inventory[index].evidences.push(doc);

    set(inventarioEditRef(inventorySaved.id),inventorySaved);
  }

  export const editInventario = (inventario, method) => (dispatch) => {
    const {
      inventarioRef, 
      inventarioEditRef
    } = firebase;
    dispatch({
      type: EDIT_INVENTARIOS,
      payload: { method, inventario }
    });
    if (method === 'Add') {
      push(inventarioRef, inventario);
    } else if (method === 'Delete') {
      remove(inventarioEditRef(inventario.id));
    } else {
      set(inventarioEditRef(inventario.id),inventario);
    }
  }
  