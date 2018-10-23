import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';

import { Auth } from "aws-amplify";



export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:""
    };
  }

  login = async event =>{
      /* Implement configuration of Authorization to cogniton*/
      Auth.signIn(this.state.username,this.state.password).then(user => alert("Logged in!")).catch(alert("Loging failed!"));
  }

  changeUsername = (event) => {
      /*Implement validation of username*/

      this.setState({ username: event.target.value });
  }

  changePassword = (event) => {
    /*Implement validation of password*/

    this.setState({ password: event.target.value });
  }

  render(){
    return (
      <form onSubmit={this.login}>
       Username: <input className="input" value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
       Password: <input className="input" value={this.state.password} onChange={this.changePassword} type="password" name="password" required />
       <input type="submit" value="Login" />
      </form>
    )
  }
}
