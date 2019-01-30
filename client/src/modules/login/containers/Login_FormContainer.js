import { connect, } from 'react-redux';
import { login, logout } from '../actions';
import Login_Form from '../components/Login_Form';


const mapStateToProps = state => {
  return {
    currentUserId: state.login.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loggedIn: (userId) => dispatch(login(userId)),
    loggedOut: () => dispatch(logout()),
  }
};

const Login_FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login_Form);

export default Login_FormContainer;
