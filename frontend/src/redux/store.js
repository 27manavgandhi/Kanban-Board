import { applyMiddleware, combineReducers, compose, legacy_createStore } from 'redux'
import thunk from 'redux-thunk'

import { reducer as authReducer } from './auth/auth.reducer';
import { reducer as boardReducer } from './board/board.reducer';
import { reducer as tasksReducer } from './tasks/tasks.reducer';


const rootReducer = combineReducers({
     authManager: authReducer,
     boardManager: boardReducer,
     tasksManager: tasksReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));