import { connect, } from 'react-redux';
import { logout } from '../../login/actions';
import MainMenuLogoutButton from '../components/MainMenuLogoutButton';


const mapStateToProps = state => {
  return {
    currentUserId: state.login.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loggedOut: () => dispatch(logout()),
  }
};

const MainMenuLogoutButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenuLogoutButton);

export default MainMenuLogoutButtonContainer;
