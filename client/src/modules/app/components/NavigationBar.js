/* In this file, is implementation of the navigation bar and implementation of
mainmenu which opens from navigation bar.*/

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { Auth } from 'aws-amplify';

/* Styles and icons */
import styles from '../../../styles/navigationbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from 'react-transition-group';

/* Mainmenu components*/
import MainMenu_ListItem from '../../mainmenu/components/MainMenu_ListItem'
import MainMenu_LogoutButton from '../../mainmenu/components/MainMenu_LogoutButton'



class NavigationBar extends React.Component {

  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userLogged: false,
      admin: false,
      restaurantOwner:false,
      moderator: false
    };
    this.mainMenu = this.mainMenu.bind(this);
    this.home = this.home.bind(this);
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
                  <MainMenu_ListItem path="/" text="Pääsivu" />
                  <MainMenu_ListItem path="/map" text="Kartta" />
                  <MainMenu_ListItem path="/restaurant_list" text="Ravintola lista" />
                  {this.state.restaurantOwner && <MainMenu_ListItem path="/restaurant_management" text="Ravintola hallinta" />}
                  {this.state.admin && <MainMenu_ListItem path="/admin" text="Admin" />}
                  {this.state.moderator && <MainMenu_ListItem path="/moderating" text="Moderointi" />}
                  {this.state.userLogged && <MainMenu_ListItem path="/profile" text="Profiili" />}
                  {!this.state.userLogged && <MainMenu_ListItem path="/login" text="Kirjaudu" />}
                  {!this.state.userLogged && <MainMenu_ListItem path="/register" text="Rekisteröidy" />}
                  {this.state.userLogged && <MainMenu_LogoutButton/>}
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
            <NavLink tag={Link} to="/">
              <FontAwesomeIcon className="icon" style={iconStyles} icon="home" onClick={this.home}/>
            </NavLink>
          </Navbar>
        </div>

      );
    }
}


export default NavigationBar;
