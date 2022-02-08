import axios from 'axios';
import { 
    AUTH_LOGIN, 
    AUTH_LOGIN_SUCCESS, 
    AUTH_LOGIN_FAILURE, 
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT,
    ALERT_STATUS,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE
} from './ActionTypes';

// api 인증
// thunk함수로 action객체를 리듀서로 보낸다.

// 로그인 요청을 보낸다.
export function loginRequest() {
    return (dispatch) => {
        dispatch(login());
        return axios.get('/auth/isLogin').then((response) => {
                if(response.data == null) {
                    dispatch(loginFailure());
                } else {
                    dispatch(loginSuccess(response.data));
                }
            }).catch((error) => {
                console.log(`loginRequest() ERROR ::: ${error}`)
                dispatch(loginFailure())
        })
   }
}

export function alertHidden(){
    return (dispatch) => {
        dispatch(hidden());
    }
}

export function hidden() {
    return {
        type : ALERT_STATUS
    }
}


export function login() {
    return {
        type : AUTH_LOGIN
    };
}

export function loginSuccess(user) {
    return {
        type : AUTH_LOGIN_SUCCESS,
        user
    }
}

export function loginFailure() {
    return {
        type : AUTH_LOGIN_FAILURE
    }
}


export function getStatusRequest(token) {
    return (dispatch) => {
        if(typeof token === undefined) {
            dispatch(getStatusFailure())
        } else {
            dispatch(getStatus())
            return axios.get('/auth/isAuthenticated', {params: {'token' : token}})
                .then(async (response) => {
                    if(response.data == true) {
                        dispatch(getStatusSuccess());
                    } else {
                        dispatch(getStatusFailure());
                    }
                }).catch((err) => {
                    console.log(err)
                    dispatch(getStatusFailure());
                });
            
        }
    };
}


export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess() {
    return {
        type: AUTH_GET_STATUS_SUCCESS
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}



export function logoutRequest() {
    return (dispatch) => {
        console.log('logout')
        return axios.get('/auth/logout').then((response) => {
            if(response.status == 200) {
                dispatch(logout())
            }
            console.log(response.status)
            }).catch((error) => {
                console.log(error)
        })
   }
}

export function logout() {
    return {
        type : AUTH_LOGOUT
    }
}


// 토큰 갱신.. 
export function refreshRequest(request) {
    return (dispatch) => {
        if(request) {
            // 세션 갱신하면 token 값 갱신하기.. 재 로그인 처리해도 될듯 .. loginRequets();
            return axios.post('/auth/refreshToken').then((response) => {
                try{
                    console.log(JSON.stringify(response.data))
                    if(response.status == "200") { 
                        dispatch(refreshSuccess(response.data.access_token));
                    } else {
                        dispatch(refreshFailure());
                    }
                }catch(error){
                    console.log(error)
                    dispatch(refreshFailure());
                }
            })
        } else {
            // 세션 갱신 안하면 refresh값 true로 두고 서버 단에서는 session destory, 프론트 logoutRequest()처리하기.
            dispatch(refreshFailure());
        }
        
    }
}

export function refreshSuccess(token) {
    return {
        type: REFRESH_TOKEN_SUCCESS,
        token
    };
}

export function refreshFailure() {
    return {
        type :REFRESH_TOKEN_FAILURE
    }
}
