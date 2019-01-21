import * as t from './actionTypes';


export const login = (cognitoUser, userId) => ({
  type: t.LOGIN,
  cognitoUser: cognitoUser,
  userId: userId,
});

export const logout = () => ({
  type: t.LOGOUT,
  cognitoUser: null,
  userId: null,
});
