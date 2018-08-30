

const initialState = {
    byId: [],
    byHash: {}
}

export const history = (state = initialState, action) => {
    switch (action.type) {
    
        default:
            return state;
    }
}

// actions flag //
export const actionPoHist = {
    poState: (payload) => ({
        type: actionConstants.UPDATE_PO_HIST,
        payload
    }),
  
}
