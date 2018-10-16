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


class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar color="light">
          <NavbarToggler onClick={this.toggleNavbar}>
            <FontAwesomeIcon icon="bars"/>
          </NavbarToggler>
          <Nav navbar>
            <NavItem>
              This is just a test, the menu should 
              be a side bar or something
            </NavItem>
            <NavLink tag={Link} to="/">
              Etusivu
            </NavLink>
            <NavLink tag={Link} to="/login">
              Kirjaudu
            </NavLink>
            <NavLink tag={Link} to="/profile">
              Profiili
            </NavLink>
            <NavLink tag={Link} to="/register">
              Rekisteröidy
            </NavLink>
          </Nav>
        </Navbar>
      </div>
    );
  }
}


export default Footer;
