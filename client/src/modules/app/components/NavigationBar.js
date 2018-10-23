import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MainMenu_ListItem from '../../mainmenu/components/MainMenu_ListItem/MainMenu_ListItem'
import MainMenu_LogoutButton from '../../mainmenu/components/MainMenu_LogoutButton'
import { Auth } from 'aws-amplify';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false,userLogged: false, admin: false, restaurantOwner:false};
    this.mainMenu = this.mainMenu.bind(this);
    this.home = this.home.bind(this);
  }

  /* Function which will be called when menu button is clicked. */
  mainMenu() {
      /* Sets menu visibility to visible or no visible. */
      this.setState({ visible: !this.state.visible});
      this.checkAccessRights();
  }

  /* Function which will be called when home button is clicked. */
  home() {
    /* Closes menu, if menu is open */
    if(this.state.visible === true){
      this.mainMenu();
    }
  }

  checkAccessRights(){
    /* Implement user query from back end */
    var loggedUser = {} ;
    Auth.currentAuthenticatedUser()
        .then(user => {
          var groups = user['cognito:groups']
          /* Check if user is logged in, after that show either register or login */
          this.setState({userLogged: true})

          /* Check if user has admin access, after that show admin page */
          if(groups.find('admin')){
            this.setState({admin: true})
          }
          else{
            this.setState({admin: false})
          }
          /* Check if user is restaurant owner, after that show restaurant page */
          if(groups.find('restaurantOwner')){
            this.setState({restaurantOwner: true})
          }
          else{
            this.setState({restaurantOwner: false})
          }
        })
        .catch(err => {
          this.setState(
            {
              userLogged: false,
              admin: false,
              restaurantOwner:false
            }
          )
        });



  }

  render() {

      const menuStyle = {
        'backgroundColor':'#aaff80',
        'color': 'white',
        'display': 'block',
        'width':'15%',
        'z':'1',
        'height':'100%',
        'position': 'fixed',
        'top':'0px',
      }

      const navBarStyle = {
        'backgroundColor':'#aaff80',
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
        'margin':'25vh 0 0 0'
      }
      const x = 100;
      const y = 100;
      if(this.state.visible){
        const menuStyle = {
          'backgroundColor':'#aaff80',
          'color': 'white',
          'display': 'block',
          'width':'15%',
          'z':'1',
          'height':'100%',
          'position': 'fixed',
          'top':'0px',
          transform: `translate(${x}px, ${y}px)`
        };
      }

      return (
        <div>
          <div>
          {this.state.visible &&
            <Nav style={menuStyle} onClick={this.mainMenu}>
              <div style={menuItemsBox}>
                <MainMenu_ListItem path="/" text="Home" />
                <MainMenu_ListItem path="/map" text="Map" />
                <MainMenu_ListItem path="/restaurant_list" text="Restaurant list" />
                {this.state.restaurantOwner && <MainMenu_ListItem path="/restaurant_management" text="Restaurant management" />}
                {this.state.admin && <MainMenu_ListItem path="/admin" text="Admin" />}
                {this.state.userLogged && <MainMenu_ListItem path="/profile" text="Profile" />}
                {!this.state.userLogged && <MainMenu_ListItem path="/login" text="Login" />}
                {!this.state.userLogged && <MainMenu_ListItem path="/register" text="Register" />}
                {this.state.userLogged && <MainMenu_LogoutButton/>}
              </div>
            </Nav>
          }
          </div>
          <Navbar style={navBarStyle}>

            <NavbarToggler onClick={this.mainMenu}>
              <FontAwesomeIcon style={iconStyles} icon="bars"/>
            </NavbarToggler>

            <header className="header" style={{'Align':'center'}}>
              <h1>{this.props.header_text}</h1>
            </header>

            <NavLink tag={Link} to="/">
              <FontAwesomeIcon style={iconStyles} icon="home" onClick={this.home}/>
            </NavLink>


          </Navbar>


        </div>
      );
    }
}


export default NavigationBar;
