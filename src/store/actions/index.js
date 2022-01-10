export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";

export function loginRequest(username) {
    
    return (dispatch) => {
        dispatch(loginSuccess())
    }
}

export function loginSuccess(username) {
    
    return {
        type: AUTH_LOGIN_SUCCESS
    }
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    }
}