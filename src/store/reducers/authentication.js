import { AUTH_LOGIN_FAILURE, AUTH_LOGIN_SUCCESS } from "../actions"

const initialState = [
    {
        id: 1,
        title: ' This is First Post',
        description: '포스팅 1',
    }
]

const posts = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_LOGIN_SUCCESS:
            return state.concat(action.post);
        case AUTH_LOGIN_FAILURE:
            return state.filter(post => post.id !== action.id)
        default:
          return state;
      }
};

export default posts;