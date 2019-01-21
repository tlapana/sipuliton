import { connect } from 'react-redux';
import { login, logout } from '../actions';
import Login_Form from '../components/Login_Form';


const mapStateToProps = state => {
  return {
    cognitoUser: state.login.cognitoUser,
    currentUserId: state.login.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (cognitoUser, userId) => dispatch(login(cognitoUser, userId)),
    logout: () => dispatch(logout()),
  }
};

const Login_FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login_Form);

export default Login_FormContainer;
