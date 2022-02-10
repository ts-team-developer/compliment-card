import * as types from '../actions/ActionTypes';


// login : 로그인 상태
// status : 인증상태
// user : 유저 정보
const initialState = {
    login : {
        status : 'INIT',
        refresh : false
    },
    status : {
        valid : false,
        isLoggedIn: false,
        currentUser : null,
        quarterInfo : null,
        show : true
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
                    refresh : false,
                    isLoggedIn : true,
                    valid : false
                },
                status : {
                    ...state.status,
                    isLoggedIn : true,
                    currentUser : action.user.loginUser,
                    quarterInfo : action.user.quarterInfo,
                    show : !(action.user.quarterInfo.ISCLOSED == 'Y' && action.user.quarterInfo.ISRECCLOSED == 'Y')
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
                    refresh : false
                },
                status : {
                    ...state.status,
                    currentUser : {
                        ...state.status.currentUser,
                        ACCESS_TOKEN : action.token
                    }
                }
            }

        case types.REFRESH_TOKEN_FAILURE :
            return {
                    ...state,
                    login : {
                        ...state.login,
                        refresh : true,
                    }
                }

      

        case types.AUTH_GET_STATUS:
            return {
                ...state,
                status : {
                    ...state.status,
                }
            }
            
         case types.AUTH_GET_STATUS_SUCCESS :
            return {
                status : {
                    ...state.status,
                    valid : true,
                }
            }
            
        case types.AUTH_GET_STATUS_FAILURE:
            return {
                ...state,
                status: {
                    valid: false,
                    isLoggedIn: false
                }
            }
        case types.ALERT_STATUS :
            return {
                ...state,
                status : {
                    ...state.status,
                    show : false 
                }
            }

        default : 
            return state;
    }
}