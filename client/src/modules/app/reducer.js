import * as t from './actionTypes';


const initialState = {
  isLoading: false,
  isRounding: false,
  theme: 'theme-1',
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case t.CHANGE_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isRounding
      });
    case t.CHANGE_ROUNDING:
      return Object.assign({}, state, {
        isRounding: action.isRounding
      });
    case t.CHANGE_THEME:
      return Object.assign({}, state, {
        theme: action.theme
      });
    default:
      return state;
  }
}

export default app;
