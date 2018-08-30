import { api } from './utils/api'
import { actionConstants } from './utils/constants'


export const refresh = (state = { inclUrl: false, newCode: '' }, action) => {
    switch (action.type) {
        case (actionConstants.ADD_URL_LINK):
            return action.payload;
        case (actionConstants.ADD_AUTH_CODE):
            return {...state, newCode:action.payload};
        default:
            return state;
    }
}

// actions flag //
export const actionRefresh = {
    addUrlLink: (payload) => ({
        type: actionConstants.ADD_URL_LINK,
        payload
    }),
    authCode: (payload) => ({
        type: actionConstants.ADD_AUTH_CODE,
        payload
    }),
}


// actions utils //
export const getRefresh = () => {
    return dispatch => {
        dispatch(api.get('/get/refresh'))
            .then(response => {
                if (response.inclUrl === true) {
                    dispatch(actionRefresh.addUrlLink(response))
                }


            })
    }
}

export const updateAuthLink = (authCode) => {

    console.log(authCode)
    return dispatch => {
        dispatch(actionRefresh.authCode(authCode))
    }

}

export const updateAuth = (newCode) => {
    return dispatch => {
        dispatch(api.post('/post/newCode',newCode ))
            .then(response => {
                console.log(response )
            })
    }
}