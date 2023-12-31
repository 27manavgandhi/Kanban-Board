import * as boardTypes from './board.types';
import { AUTH_LOGOUT } from '../auth/auth.types';
import { DELETE_TASKS } from '../tasks/tasks.types';

let savedNavigate;

// Get Boards names based on the logged-in user
export const getBoards = (navigate) => async (dispatch) => {
     savedNavigate = navigate;

     dispatch({ type: boardTypes.BOARD_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/board`, {
               method: 'GET',
               headers: {
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          if (res.ok) {
               dispatch({ type: boardTypes.GET_BOARD_SUCCES, payload: data })
          } else {
               dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message })
          }

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`);
               return;
          }
     } catch (error) {
          console.log('error:', error)
          dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message })
     }
}


// Create Board
export const createBoard = (boardName) => async (dispatch) => {
     if (!boardName) return;

     dispatch({ type: boardTypes.BOARD_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/board`, {
               method: 'POST',
               body: JSON.stringify({ name: boardName }),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          if (res.ok) {
               dispatch(getBoards())
          } else {
               dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message })
          }

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT });
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`);
               return;
          }
     } catch (error) {
          console.log('error:', error)
          dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message })
     }
}


// Patch Boards
export const editBoard = (boardId, boardName) => async (dispatch) => {

     if (!boardId || !boardName) return;

     dispatch({ type: boardTypes.BOARD_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`, {
               method: 'PATCH',
               body: JSON.stringify({ name: boardName }),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          if (res.ok) {
               dispatch(getBoards());
          } else {
               dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message })
          }

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }
     } catch (error) {
          console.log('error:', error)
          dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message })
     }
}

// Delete Board
export const deleteBoard = (boardId) => async (dispatch) => {
     if (!boardId) return;

     dispatch({ type: boardTypes.BOARD_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`, {
               method: 'DELETE',
               headers: {
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          if (res.ok) {
               dispatch({ type: DELETE_TASKS });
               dispatch(getBoards());
          } else {
               dispatch({ type: boardTypes.BOARD_ERROR, payload: data.message })
          }

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }
     } catch (error) {
          console.log('error:', error)
          dispatch({ type: boardTypes.BOARD_ERROR, payload: error.message })
     }
}