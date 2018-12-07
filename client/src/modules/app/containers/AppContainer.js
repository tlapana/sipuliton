import { connect } from 'react-redux';
import { changeLoading, changeRounding, changeTheme } from '../actions';
import App from '../components/App';


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

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
