/* This file implements logout button implementation. */

import React from 'react';
import {
  NavItem,
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { Redirect } from "react-router-dom";

export default class MainMenuListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = { logoutSuccesfully: true };
    this.logout = this.logout.bind(this);
  }


  /* This method implements user log out. */
  logout(){
    Auth.signOut()
        .then(data => this.setState({logoutSuccesfully: true}))
        .catch(err => console.log(err));
  }

  render(){

    /* Styles for the log out button. */

    return (
        <NavItem className="menu-item" >
          <a className="nav-link" href="#" onClick={this.logout}>
            {this.props.logoutText}
          </a>
        {this.state.logoutSuccesfully && <Redirect to={this.props.redirectPath} />}
        </NavItem>
    );
  }
}
