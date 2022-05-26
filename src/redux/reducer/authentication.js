import * as types from '../actions/ActionTypes';


// login : 로그인 상태
// status : 인증상태
// user : 유저 정보
const initialState = {
    login : {
        status : 'INIT',
        isAutoLogout : false
    },
    status : {
        isLoggedIn: false,
        currentUser : null,
        quarterInfo : null,
        show : true,
        result : false
    }
};

export default function authentication(state, action) {
    if(typeof state === "undefined")
        state = initialState;

    switch(action.type) {
        // 로그아웃 진행
        case types.AUTH_LOGOUT :
            return initialState

        case types.AUTH_LOGIN :
            return {
                ...state,
                login : {
                    status : 'WAITING'
                }
            }
        
        case types.AUTH_LOGIN_SUCCESS :
            return {
                ...state,
                login : {
                    status : 'SUCCESS',
                    isLoggedIn : true
                },
                status : {
                    ...state.status,
                    isLoggedIn : true,
                    currentUser : action.user.loginUser,
                    quarterInfo : action.user.quarterInfo,
                    show : action.user.show,
                    result: false
                }
            }
        
        case types.AUTH_LOGIN_FAILURE :
            return {
                ...state,
                login : {
                    status : 'FAILURE'
                }
            }

        case types.REFRESH_TOKEN_SUCCESS :
            return {
                ...state,
                login : {
                    ...state.login,
                },
                status : {
                    ...state.status,
                    currentUser : {
                        ...state.status.currentUser,
                        ACCESS_TOKEN : action.token,
                    },
                    result : false
                }
            }

        case types.REFRESH_TOKEN_FAILURE :
            return {
                    ...state,
                    login : {
                        ...state.login,
                        isAutoLogout : true,
                    },
                    result : true
                }

        case types.ALERT_STATUS :
            return {
                ...state,
                status : {
                    ...state.status,
                    show : false 
                }
            }
            case types.QUARTER_STATUS_SUCCESS :
                return {
                    ...state,
                    status : {
                        ...state.status,
                        show : action.data.show,
                        quarterInfo : action.data.quarterInfo,
                    }
                }

        default : 
            return state;
    }
} 