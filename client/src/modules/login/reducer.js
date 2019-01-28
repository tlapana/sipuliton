import * as t from './actionTypes';


const initialState = {
  user_id: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case t.LOGIN:
      return Object.assign({}, state, {
        userId: action.userId,
      });
    case t.LOGOUT:
      return Object.assign({}, state, {
        userId: null,
      });
    default:
      return state;
  }
}

export default login;
