import { connect } from 'react-redux';
import Profile from '../components/Profile';


const mapStateToProps = state => {
  return {
    currentUserId: state.login.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
};

const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

export default ProfileContainer;
