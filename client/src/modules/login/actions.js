import * as t from './actionTypes';


export const login = (cognitoUser) => ({
  type: t.LOGIN,
  cognitoUser
});

export const logout = (user) => ({
  type: t.LOGOUT,
  user
});
