/*
  A container for ThemedModal that hooks it to theme related props with Redux.
*/

import { connect } from 'react-redux';
import * as actions from  '../actions';
import * as components from  '../components';


const {changeLoading, changeRounding, changeTheme} = actions;
const {ThemedModal, } = components;

const mapStateToProps = state => {
  return {
    isLoading: state.app.isLoading,
    isRounding: state.app.isRounding,
    theme: state.app.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeLoading: isLoading => dispatch(changeLoading(isLoading)),
    changeRounding: isRounding => dispatch(changeRounding(isRounding)),
    changeTheme: newTheme => dispatch(changeTheme(newTheme))
  }
};

const ThemedModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemedModal);

export default ThemedModalContainer;
