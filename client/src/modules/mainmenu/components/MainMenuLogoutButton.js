/* This file implements logout button implementation. */

import React from 'react';
import {
  NavItem,
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { Redirect, withRouter } from "react-router-dom";

class MainMenuLogoutButton extends React.Component{
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }


  /* This method implements user log out. */
  logout(){
    Auth.signOut()
        .then(data => {
          this.props.loggedOut();
          this.props.history.push(this.props.redirectPath);
        })
        .catch(err => console.log(err));
  }

  render(){

    /* Styles for the log out button. */

    return (
        <NavItem className="menu-item" >
          <a className="nav-link" href="#" onClick={this.logout}>
            {this.props.logoutText}
          </a>
        </NavItem>
    );
  }
}


const MainMenuLogoutButtonWithRouter = withRouter(MainMenuLogoutButton);
export default MainMenuLogoutButtonWithRouter;
