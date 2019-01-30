import * as t from './actionTypes';


export const login = (userId) => ({
  type: t.LOGIN,
  
  userId: userId,
});

export const logout = () => ({
  type: t.LOGOUT,
  userId: null,
});
