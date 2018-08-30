const fetchGet = (endpoint, data) => {
    let status = 0
    return (dispatch) => {
        let queryString = endpoint 
        
        if (data!= undefined && data.length > 0) {
            queryString = endpoint + '?'
            data.forEach(param => {
                queryString = queryString + param.key + '=' + param.var
            })
        }
        return fetch(queryString, {
            'Access-Control-Allow-Methods': '*',
            credentials: 'same-origin',
        })
            .then(response => {
                status = response.status
                return response.json()
            })
            .then(data => {
                return { ...data, status: status }
            })
    }
};

const fetchPost = (endpoint, data) => {
    let status = 0
    return (dispatch) => {
        return fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'same-origin',
            headers: new Headers({
                'content-type': 'application/json'
            }),
        })
            .then(response => {
                status = response.status
                return response.json()
            })
            .then(data => {
                return { ...data, status: status }
            })
    }
}

export const api = {
    get: (endpoint, data) => {
        return fetchGet(endpoint, data);
    },
    post: (endpoint, data) => {
        return fetchPost(endpoint, data);
    },
}