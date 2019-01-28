import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Auth } from 'aws-amplify';
import RouteCollection from './RouteCollection';
import NavigationBar from './NavigationBar';
import write_review from '../../writereview';

import '../../../styles/app.css';
import '../../../styles/themes.css';

import AppFunctionsGlobalAPI from './AppGlobalFunctions'

class App extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userData: {
        userLogged: false,
        admin: false,
        restaurantOwner:false,
        moderator: false,
      }
    };

    //function bindings
    this.mainMenu = this.mainMenu.bind(this);
    this.closeMainMenu = this.closeMainMenu.bind(this);
    this.checkAccessRights = this.checkAccessRights.bind(this);
  }

  /* Function which will be called when menu button is clicked. */
  mainMenu() {
      /* Sets menu visibility to visible or not visible. */
      let isVisible = !this.state.visible;
      if (isVisible) {
        this.checkAccessRights();
      }
      this.setState({ visible: isVisible });
  }

  //Method closes mainmenu
  closeMainMenu(){
    this.setState({ visible: false });
  }

  /* This function checks logged in users rights. */
  checkAccessRights() {
    /* Get user information. */
    Auth.currentAuthenticatedUser()
        .then(user => {
          /* Check if user is logged in, after that set access to either register or login */
          if(user != null)
          {

            var logged = true;
            var admin = false;
            var moderator = false;
            var roOwner = false;

            var userGroup = "";
            /* Get current user group. */
            try
            {
              var userGroup = user.signInUserSession.accessToken.payload["cognito:groups"][0];
            }
            catch
            {
              console.log("user not in any user group!")
            }

            /* Check if user has admin access, after that set access to admin pages */
            if(userGroup === "SipulitonAdminUserGroup"){
              admin = true;
            }

            /* Check if user is restaurant owner, after that set access to restaurant pages */
            if(userGroup === 'SipulitonROUserGroup'){
              roOwner = false;
            }

            /* Check if user has moderator access, after that set access to moderator pages */
            if(userGroup === "SipulitonModUserGroup"){
              moderator = true;
            }
            this.setState({
              userData: {
                userLogged: logged,
                admin: admin,
                restaurantOwner:roOwner,
                moderator: moderator,
              },
              visible: true
            })
          }
          else{
              this.setState({
                userData: {
                  userLogged: false,
                  admin: false,
                  restaurantOwner:false,
                  moderator: false,
                },
                visible: true
              })
          }

        })
        .catch(err => {
          /* If user is not logged in restrict accesses. */
          this.setState(
            {
              userData: {
                userLogged: false,
                admin: false,
                restaurantOwner:false,
                moderator: false,
              },
              visible: true
            }
          )
        });
  }

  render() {

    let classes = AppFunctionsGlobalAPI.getAppClasses(this.props);
    return(
      <Provider store={this.props.store}>
        <Router>
          <div className={classes} onClick={this.closeMainMenu}>
            <div className="content">
              <Container className="main-content" >
                <Switch>
                  <RouteCollection/>
                </Switch>
              </Container>
              <NavigationBar header_text="Sipuliton.fi" showMenu={this.state.visible} mainmenu={this.mainMenu} userData={this.state.userData}/>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isRounding: PropTypes.bool,
  theme: PropTypes.string,
};

export default App;
