import { connect } from 'react-redux';
import { changeLoading, changeRounding, changeTheme } from '../actions';
import App from '../components/App';


const mapStateToProps = state => {
  console.log("test",state);
  return {
    isLoading: state.isLoading,
    isRounding: state.isRounding,
    theme: state.theme
  }
  
};
​
const mapDispatchToProps = dispatch => ({
  changeLoading: isLoading => dispatch(changeLoading(isLoading)),
  changeRounding: isRounding => dispatch(changeRounding(isRounding)),
  changeTheme: newTheme => dispatch(changeTheme(newTheme))
});
​
const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
