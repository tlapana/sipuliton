import * as t from './actionTypes';


const initialState = {
  cognitoUser: null,
  user_id: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case t.LOGIN:
      return Object.assign({}, state, {
        cognitoUser: action.cognitoUser,
        userId: action.userId,
      });
    case t.LOGOUT:
      return Object.assign({}, state, {
        cognitoUser: null,
        userId: null,
      });
    default:
      return state;
  }
}

export default login;
