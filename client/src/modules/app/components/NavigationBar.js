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
import { LanguageSelection, MainMenuListItem, MainMenuLogoutButtonContainer } from '../../mainmenu/index';

/* Localization */
import LocalizedStrings from 'react-localization';

import AppFunctionsGlobalAPI from './AppGlobalFunctions'

class NavigationBar extends React.Component {

  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      language:'fi',
      redirectUrl:"",
      languageChanged:false
    };

    this.home = this.home.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  /* Function which will be called when home button is clicked. */
  home() {
    /* Closes menu, if menu is open */
    if(this.props.showMenu === true){
      this.props.mainMenu();
    }
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
          logout: "Logout",
          about: "About",
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
          logout:"Kirjaudu ulos",
          about: "Tietoja",
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
      const pathToRestaurantManagement = "/" + this.state.language + "/restaurant_management";
      const pathToAdmin = "/" + this.state.language + "/admin";
      const pathToModerating = "/" + this.state.language + "/moderating";
      const pathToProfile = "/" + this.state.language + "/profile";
      const pathToLogin = "/" + this.state.language + "/login";
      const pathToRegister = "/" + this.state.language + "/register";
      const pathToAbout = "/" + this.state.language + "/about";

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
            <Transition in={this.props.showMenu} out={!this.props.showMenu} timeout={duration}>
              {(state) => (
                <div>
                  <Nav
                    vertical
                    className="side-menu"
                    onClick={this.props.mainmenu}
                    style={{...transitionStyles[state]}}
                  >
                    <MainMenuListItem path={pathToMenu} text={strings.mainmenu} />
                    <MainMenuListItem path={pathToMap} text={strings.map} />
                    {this.props.userData.userLogged && <MainMenuLogoutButtonContainer redirectPath={pathToMenu} logoutText={strings.logout}/>}
                    {this.props.userData.restaurantOwner && <MainMenuListItem path={pathToRestaurantManagement} text={strings.restaurantManagement} />}
                    {this.props.userData.admin && <MainMenuListItem path={pathToAdmin} text={strings.admin} />}
                    {this.props.userData.moderator && <MainMenuListItem path={pathToModerating} text={strings.moderation} />}
                    {this.props.userData.userLogged && <MainMenuListItem path={pathToProfile} text={strings.profile} />}
                    {!this.props.userData.userLogged && <MainMenuListItem path={pathToLogin} text={strings.login} />}
                    {!this.props.userData.userLogged && <MainMenuListItem path={pathToRegister} text={strings.register} />}
                    <MainMenuListItem path={pathToAbout} text={strings.about}/>
                    <li>
                      <LanguageSelection changeLanguage={this.changeLanguage} />
                    </li>
                  </Nav>
                </div>
              )}
            </Transition>
          </div>

          <Navbar id="navBar" className="fixed-bottom bottom-bar">
            <NavbarToggler onClick={this.props.mainmenu}>
              <FontAwesomeIcon size="2x" className="icon" icon="bars"/>
            </NavbarToggler>
            <header className="header" style={{'Align':'center'}}>
              <div className="header">{this.props.header_text}</div>
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
