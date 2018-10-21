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


class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.mainMenu = this.mainMenu.bind(this);
    this.home = this.home.bind(this);
  }

  /* Function which will be called when menu button is clicked. */
  mainMenu() {
      /* Sets menu visibility to visible or no visible. */
      this.setState({ visible: !this.state.visible});
  }

  /* Function which will be called when home button is clicked. */
  home() {
    /* Closes menu, if menu is open */
    if(this.state.visible === true){
      this.mainMenu();
    }
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
        'top':'0px'
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

      return (
        <div>
          <div>
          {this.state.visible &&
            <Nav style={menuStyle} onClick={this.mainMenu}>
              <MainMenu_ListItem path="/" text="Home" />
              <MainMenu_ListItem path="/map" text="Map" />
              <MainMenu_ListItem path="/restaurant_list" text="Restaurant list" />
              <MainMenu_ListItem path="/restaurant_management" text="Restaurant management" />
              <MainMenu_ListItem path="/admin" text="Admin" />
              <MainMenu_ListItem path="/profile" text="Profile" />
              <MainMenu_ListItem path="/login" text="Login" />
              <MainMenu_ListItem path="/register" text="Register" />
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
