import * as t from './actionTypes';


export const changeLoading = (isLoading) => ({
  type: t.CHANGE_LOADING,
  isLoading
});

export const changeRounding = (isRounding) => ({
  type: t.CHANGE_ROUNDING,
  isRounding
});

export const changeTheme = (newTheme) => ({
  type: t.CHANGE_THEME,
  theme: newTheme
});

