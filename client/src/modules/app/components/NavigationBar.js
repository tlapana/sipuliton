/* In this file, is implementation of the navigation bar and implementation of
mainmenu which opens from navigation bar.*/

import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';
import { Auth } from 'aws-amplify';

/* Styles and icons */
import styles from '../../../styles/navigationbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from 'react-transition-group';

/* Mainmenu components*/
import MainMenu_ListItem from '../../mainmenu/components/MainMenu_ListItem'
import MainMenu_LogoutButton from '../../mainmenu/components/MainMenu_LogoutButton'

/* Localization */
import LocalizedStrings from 'react-localization';


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
    this.ChangeToEngland = this.ChangeToEngland.bind(this);
    this.ChangeToFinland = this.ChangeToFinland.bind(this);
  }

  /* Function which will be called when menu button is clicked. */
  mainMenu() {
      /* Sets menu visibility to visible or not visible. */
      this.setState({ visible: !this.state.visible});
      if(this.state.visible){
        this.checkAccessRights();
      }
  }

  /* Function which will be called when home button is clicked. */
  home() {
    /* Closes menu, if menu is open */
    if(this.state.visible === true){
      this.mainMenu();
    }
  }

  /* This function checks logged in users rights. */
  checkAccessRights(){
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

  ChangeToFinland(){
    var url = window.location.href
    url = url.replace(this.state.language,'fi');
    var index = url.search('://');
    url = url.slice(index+3);
    index = url.search('/');
    url = url.slice(index);
    console.log(url);
    this.setState({language:'fi',redirectUrl:url,languageChanged:true});

  }
  ChangeToEngland(){
    var url = window.location.href
    url = url.replace(this.state.language,'en');
    var index = url.search('://');
    url = url.slice(index+3);
    index = url.search('/');
    url = url.slice(index);
    console.log(url);
    this.setState({language:'en',redirectUrl:url,languageChanged:true});
  }

  render() {
      /* Navigation bar inline styles. */
      const navBarStyle = {
        'backgroundColor':'#99ff99',
        'color': 'white',
        'display': 'inlineblock',
        'width':'100%',
        'alignItems':'left',
        'position':'fixed',
        'bottom':'0'
      }

      const iconStyles = {
        'color':'black',
        'width':'50px',
        'height':'50px'
      }

      const menuItemsBox = {
        'margin':'25px 0 0 0'
      }

      /* Menu appearance styles. */
      const duration = 200;
      const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        'backgroundColor':'#99ff99',
        'color': 'white',
        'display': 'block',
        'width':'25%',
        'left':'-500px',
        'height':'100%',
        'position': 'fixed',
        'top':'0px',
      }

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

      if(this.state.language == "fi"){
        strings.setLanguage('fi');
      }
      if(this.state.language == "en"){
        strings.setLanguage('en');
      }

      /* URL Paths to pages*/
      const pathToMenu = "/"+this.state.language
      const pathToMap = "/map/"+this.state.language
      const pathToRestaurantList = "/restaurant_list/"+this.state.language
      const pathToRestaurantManagement = "/restaurant_management/"+this.state.language
      const pathToAdmin = "/admin/"+this.state.language
      const pathToModerating = "/moderating/"+this.state.language
      const pathToProfile = "/profile/"+this.state.language
      const pathToLogin = "/login/"+this.state.language
      const pathToRegister = "/register/"+this.state.language

      /* Changed correct language to page after clicking change language. */
      if(this.state.languageChanged){
        this.setState({languageChanged:false});
        return(
          <Redirect to={this.state.redirectUrl}/>
        )
      }

      return (

        <div>
          <div>
          <Transition in={this.state.visible} out={!this.state.visible}
            timeout={duration}
            >
            {(state) => (
              <Nav style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }} onClick={this.mainMenu}>
                <div className="menuItems" style={menuItemsBox}>
                  <MainMenu_ListItem path={pathToMenu} text={strings.mainmenu} />
                  <MainMenu_ListItem path={pathToMap} text={strings.map} />
                  <MainMenu_ListItem path={pathToRestaurantList} text={strings.restaurantList} />
                  {this.state.restaurantOwner && <MainMenu_ListItem path={pathToRestaurantManagement} text={strings.restaurantManagement} />}
                  {this.state.admin && <MainMenu_ListItem path={pathToAdmin} text={strings.admin} />}
                  {this.state.moderator && <MainMenu_ListItem path={pathToModerating} text={strings.moderation} />}
                  {this.state.userLogged && <MainMenu_ListItem path={pathToProfile} text={strings.profile} />}
                  {!this.state.userLogged && <MainMenu_ListItem path={pathToLogin} text={strings.login} />}
                  {!this.state.userLogged && <MainMenu_ListItem path={pathToRegister} text={strings.register} />}
                  {this.state.userLogged && <MainMenu_LogoutButton redirectPath={pathToMenu} logoutText={strings.logout}/>}
                </div>
                <div>
                  <Button onClick={this.ChangeToFinland}>Finland</Button>
                  <Button onClick={this.ChangeToEngland}>England</Button>
                </div>
              </Nav>
            )}
          </Transition>

          </div>
          <Navbar id="navBar" style={navBarStyle}>
            <NavbarToggler onClick={this.mainMenu}>
              <FontAwesomeIcon className="icon" style={iconStyles} icon="bars"/>
            </NavbarToggler>
            <header className="header" style={{'Align':'center'}}>
              <h1>{this.props.header_text}</h1>
            </header>
            <NavLink tag={Link} to={pathToMenu}>
              <FontAwesomeIcon className="icon" style={iconStyles} icon="home" onClick={this.home}/>
            </NavLink>
          </Navbar>
        </div>

      );
    }
}


export default NavigationBar;
