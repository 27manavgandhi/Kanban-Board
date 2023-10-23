import * as authTypes from './auth.types';

let savedNavigate, savedToastMsg;

export const signin = (cred, navigate, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (navigate) savedNavigate = navigate;
     else navigate = savedNavigate;


     if (!cred.email || !cred.password) return;

     dispatch({ type: authTypes.AUTH_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signin`, {
               method: 'POST',
               body: JSON.stringify(cred),
               headers: {
                    'Content-Type': 'application/json'
               }
          })

          const data = await res.json();

          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${navigate ? navigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) {
               dispatch({ type: authTypes.AUTH_LOGIN_SUCCESS, payload: data.user });
               navigate('/');
          } else {
               dispatch({ type: authTypes.AUTH_ERROR });
          }

          toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning',
          })

     } catch (error) {
          console.log('error:', error);
          dispatch({ type: authTypes.AUTH_ERROR });
          toastMsg({
               title: error.message,
               status: 'error'
          });
     }
}


export const signup = (cred, navigate, toastMsg) => async (dispatch) => {
     if (toastMsg) savedToastMsg = toastMsg;
     else toastMsg = savedToastMsg;

     if (navigate) savedNavigate = navigate;
     else navigate = savedNavigate;

     if (!cred.username || !cred.email || !cred.password) return;

     // ? EMAIL VERIFIER
     if (!cred.email.includes('@') || !cred.email.includes('mail')) {
          toastMsg({
               title: 'Enter a valid email address!',
               status: 'warning'
          })
          return;
     }

     // ? PASSWORD VERIFIER
     if (cred.password.length <= 5) {
          toastMsg({
               title: 'Password must contain more than 5 char!',
               status: 'warning'
          })
          return;
     }

     dispatch({ type: authTypes.AUTH_LOADING });

     try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/signup`, {
               method: "POST",
               body: JSON.stringify(cred),
               headers: {
                    'Content-Type': 'application/json'
               }
          })

          const data = await res.json();


          // * IF TOKEN EXPIRED
          if (res.status === 401) {
               dispatch({ type: AUTH_LOGOUT })
               alert(`Session Expired! \n Please Login again.. ${navigate ? navigate('/signin') : window.location.replace('/signin')}`)
               return;
          }

          if (res.ok) navigate('/signin');
          dispatch({ type: res.ok ? authTypes.AUTH_SUCCESS : authTypes.AUTH_ERROR });

          toastMsg({
               title: data.message,
               status: res.ok ? 'success' : 'warning',
          });
     } catch (error) {
          console.log('error:', error);
          dispatch({ type: authTypes.AUTH_ERROR })
          toastMsg({
               title: error.message,
               status: 'error'
          });
     }
}