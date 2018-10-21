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
  }

  mainMenu() {
      this.setState({ visible: !this.state.visible});
}
render() {
    const menuStyle = {
      'backgroundColor':'#aaff80',
      'color': 'white',
      'display': 'block',
      'width':'25%',

    }

    const navBarStyle = {
          'backgroundColor':'#aaff80',
          'color': 'white',
          'display': 'inlineblock',
          'width':'100%',
          'alignItems':'left'
    }

    const iconStyles = {
      'color':'black',
      'width':'50px',
      'height':'50px'
    }

    return (
      <div>

        <Navbar style={navBarStyle}>
          <NavbarToggler onClick={this.mainMenu}>
            <FontAwesomeIcon style={iconStyles} icon="bars"/>
          </NavbarToggler>

          <header className="header" style={{'Align':'center'}}>
            <h1>Sipuliton.fi</h1>
          </header>
          <NavLink tag={Link} to="/">
            <FontAwesomeIcon style={iconStyles} icon="home"/>
          </NavLink>
        </Navbar>
        {this.state.visible &&
          <Nav style={menuStyle} alignment="right" onClick={this.mainMenu}>
            <MainMenu_ListItem path="/" text="Home" />
            <MainMenu_ListItem path="/login" text="Login" />
            <MainMenu_ListItem path="/profile" text="Profile" />
            <MainMenu_ListItem path="/register" text="Register" />
          </Nav>
        }

      </div>
    );
  }
}


export default NavigationBar;
