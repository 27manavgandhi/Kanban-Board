import * as taskTypes from './tasks.types';
let abortController;

let savedNavigate, savedToastMsg;

export const getTasks = (boardId, navigate) => async (dispatch) => {
     savedNavigate = navigate;

     if (!boardId) return;

     dispatch({ type: taskTypes.TASKS_LOADING })

     abortController?.abort();
     
     abortController = new AbortController();

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/board/${boardId}`, {
               signal: abortController.signal,
               method: "GET",
               headers: {
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch({ type: taskTypes.GET_TASKS_SUCCESS, payload: data })
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message })
          }
     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
     }
}


export const postTask = (boardId, task, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (boardId === undefined) {
          toastMsg({
               title: "Can't create Task!",
               desc: "Select a board to create task inside it",
               status: 'warning'
          })
     }

     if (!boardId || !task) return;

     dispatch({ type: taskTypes.TASKS_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${boardId}`, {
               method: "POST",
               body: JSON.stringify(task),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message })
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }

}

export const updateTask = (taskId, boardId, updates, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (!taskId || !boardId || !updates) return;

     dispatch({ type: taskTypes.TASKS_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${taskId}`, {
               method: "PATCH",
               body: JSON.stringify(updates),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message });
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }
}


export const deleteTask = (taskId, boardId, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (!taskId || !boardId) return;

     dispatch({ type: taskTypes.TASKS_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/task/${taskId}`, {
               method: "DELETE",
               body: JSON.stringify({ boardId }),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message });
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }
}

export const postSubTask = (taskId, boardId, subTasks, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (!taskId || !boardId || !subTasks || !subTasks.length) return;

     dispatch({ type: taskTypes.TASKS_LOADING })

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${taskId}`, {
               method: "POST",
               body: JSON.stringify(subTasks),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message })
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }

}

export const updateSubTask = (subTaskId, boardId, updates, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (!subTaskId || !boardId || !updates) return;

     dispatch({ type: taskTypes.TASKS_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${subTaskId}`, {
               method: "PATCH",
               body: JSON.stringify(updates),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message });
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }
}

export const deleteSubTask = (subTaskId, taskId, boardId, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (!subTaskId || !taskId || !boardId) return;

     dispatch({ type: taskTypes.TASKS_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/subtask/${subTaskId}`, {
               method: "DELETE",
               body: JSON.stringify({ taskId }),
               headers: {
                    'Content-Type': 'application/json',
                    'authorization': sessionStorage.getItem("TOKEN"),
               }
          })
          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${savedNavigate ? savedNavigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch(getTasks(boardId));
          } else {
               dispatch({ type: taskTypes.TASKS_ERROR, payload: data.message });
          }

          toastMsg && toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning'
          })

     } catch (error) {
          console.log('error:', error)
          dispatch({ type: taskTypes.TASKS_ERROR, payload: error.message })
          toastMsg && toastMsg({
               title: error.message,
               status: 'error'
          })
     }
}

