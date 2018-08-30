import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { combineReducers } from 'redux'
import { history } from './modules/history'
import { newAuth } from './modules/newAuth'
import { refresh } from './modules/refresh'

const rootReducer = combineReducers(
    {
        gSheets: combineReducers({
            history: history,
            newAuth: newAuth,
            refresh: refresh,
        })
    }
);


const store = createStore(
    rootReducer , 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
      thunkMiddleware
    )
);

export default store;