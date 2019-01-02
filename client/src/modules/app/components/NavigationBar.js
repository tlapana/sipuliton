/* In this file, is implementation of the navigation bar and implementation of
mainmenu which opens from navigation bar.*/

import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavLink,
} from 'reactstrap';
import { Auth } from 'aws-amplify';

/* Styles and icons */
import '../../../styles/navigationbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from 'react-transition-group';

/* Mainmenu components*/
import { LanguageSelection, MainMenuListItem, MainMenuLogoutButton } from '../../mainmenu/index';

/* Localization */
import LocalizedStrings from 'react-localization';

import AppFunctionsGlobalAPI from './AppGlobalFunctions'

class NavigationBar extends React.Component {

  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userLogged: false,
      admin: false,
      restaurantOwner:false,
      moderator: false,
      language:'fi',
      redirectUrl:"",
      languageChanged:false
    };

    this.mainMenu = this.mainMenu.bind(this);
    this.home = this.home.bind(this);
    this.checkAccessRights = this.checkAccessRights.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
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

  /* Function which will be called when home button is clicked. */
  home() {
    /* Closes menu, if menu is open */
    if(this.state.visible === true){
      this.mainMenu();
    }
  }

  /* This function checks logged in users rights. */
  checkAccessRights() {
    /* Get user information. */
    Auth.currentAuthenticatedUser()
        .then(user => {
          /* Get current user group. */
          var userGroup = user.signInUserSession.accessToken.payload["cognito:groups"][0];
          if(user != null){
            /* Check if user is logged in, after that set access to either register or login */
            this.setState({userLogged: true})

            /* Check if user is basic user, then restrict all accesses */
            if(userGroup === "SipulitonModUserGroup"){
              this.setState({
                admin: false,
                restaurantOwner: false,
                moderator: false
              })
            }

            /* Check if user has admin access, after that set access to admin pages */
            if(userGroup === "SipulitonAdminUserGroup"){
              this.setState({admin: true})
            }
            else{
              this.setState({admin: false})
            }
            /* Check if user is restaurant owner, after that set access to restaurant pages */

            if(userGroup === 'SipulitonROUserGroup'){
              this.setState({restaurantOwner: true})
            }
            else{
              this.setState({restaurantOwner: false})
            }

            /* Check if user has moderator access, after that set access to moderator pages */
            if(userGroup === "SipulitonModUserGroup"){
              this.setState({moderator: true})
            }
            else{
              this.setState({moderator: false})
            }

          }
          else{
              this.setState({userLogged: false})
          }

        })
        .catch(err => {
          /* If user is not logged in restrict accesses. */
          this.setState(
            {
              userLogged: false,
              admin: false,
              restaurantOwner:false,
              moderator: false
            }
          )
        });

  }

  changeLanguage(language) {
    var url = AppFunctionsGlobalAPI.parseUrlToLanguageChanging(window.location.href,this.state.language, language);
    this.setState({language: language, redirectUrl: url, languageChanged: true});
  }

  render() {
      /* Menu appearance styles. */
      const duration = 0;
      const transitionStyles = {
        entering: { opacity: 0, 'left':'-500px' },
        entered:  { opacity: 1, 'left':'0px' },
        exiting: { opacity: 1, 'left':'0px' },
        exited: { opacity: 0, 'left':'-500px' }
      };

      /* Localization */
      let strings = new LocalizedStrings({
        en:{
          mainmenu:"Mainpage",
          map:"Map",
          restaurantList:"Restaurant list",
          restaurantManagement:"Restaurant management",
          admin:"Admin",
          moderation:"Moderation",
          profile:"Profile",
          login:"Login",
          register:"Register",
          logout: "Logout"
        },
        fi: {
          mainmenu:"Pääsivu",
          map:"Kartta",
          restaurantList:"Ravintola lista",
          restaurantManagement:"Ravintola hallinta",
          admin:"Admin",
          moderation:"Moderointi",
          profile:"Profiili",
          login:"Kirjaudu",
          register:"Rekisteröidy",
          logout:"Kirjaudu ulos"
        }
      });

      if(this.state.language === "fi"){
        strings.setLanguage('fi');
      }
      if(this.state.language === "en"){
        strings.setLanguage('en');
      }

      /* URL Paths to pages*/
      const pathToMenu = "/" + this.state.language;
      const pathToMap = "/" + this.state.language+"/map";
      const pathToRestaurantList = "/" + this.state.language + "/restaurant_list";
      const pathToRestaurantManagement = "/" + this.state.language + "/restaurant_management";
      const pathToAdmin = "/" + this.state.language + "/admin";
      const pathToModerating = "/" + this.state.language + "/moderating";
      const pathToProfile = "/" + this.state.language + "/profile";
      const pathToLogin = "/" + this.state.language + "/login";
      const pathToLogout = "/" + this.state.language + "/logout";
      const pathToRegister = "/" + this.state.language + "/register";


      /* Changed correct language to page after clicking change language. */
      if(this.state.languageChanged){
        this.setState({languageChanged:false});
        return(
          <Redirect to={this.state.redirectUrl}/>
        );
      }

      return (

        <div>
          <div>
            <Transition in={this.state.visible} out={!this.state.visible} timeout={duration}>
              {(state) => (
                <div>
                  <Nav
                    vertical
                    className="side-menu"
                    onClick={this.mainMenu}
                    style={{...transitionStyles[state]}}
                  >
                    <MainMenuListItem path={pathToMenu} text={strings.mainmenu} />
                    <MainMenuListItem path={pathToMap} text={strings.map} />
                    <MainMenuListItem path={pathToRestaurantList} text={strings.restaurantList} />
                    {this.state.restaurantOwner && <MainMenuListItem path={pathToRestaurantManagement} text={strings.restaurantManagement} />}
                    {this.state.admin && <MainMenuListItem path={pathToAdmin} text={strings.admin} />}
                    {this.state.moderator && <MainMenuListItem path={pathToModerating} text={strings.moderation} />}
                    {this.state.userLogged && <MainMenuListItem path={pathToProfile} text={strings.profile} />}
                    {!this.state.userLogged && <MainMenuListItem path={pathToLogin} text={strings.login} />}
                    {!this.state.userLogged && <MainMenuListItem path={pathToRegister} text={strings.register} />}
                    {this.state.userLogged && <MainMenuLogoutButton redirectPath={pathToMenu} logoutText={strings.logout}/>}
                    <li>
                      <LanguageSelection changeLanguage={this.changeLanguage} />
                    </li>
                  </Nav>
                </div>
              )}
            </Transition>
          </div>

          <Navbar id="navBar" className="fixed-bottom bottom-bar">
            <NavbarToggler onClick={this.mainMenu}>
              <FontAwesomeIcon size="2x" className="icon" icon="bars"/>
            </NavbarToggler>
            <header className="header" style={{'Align':'center'}}>
              <h1>{this.props.header_text}</h1>
            </header>
            <NavLink tag={Link} to={pathToMenu}>
              <FontAwesomeIcon size="2x" className="icon" icon="home" onClick={this.home}/>
            </NavLink>
          </Navbar>
        </div>

      );
    }
}


export default NavigationBar;
