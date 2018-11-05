/*
This file implements regular login to the application.
*/

import React from 'react';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import config from "../../../config.js"

export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded:false,
      passwordIsValid: true,
      usernameIsValid: true
    };
  }

  login = event =>{

   /* Logs user in, if password or username
      is not valid login will automatically fail. */

      event.preventDefault();
      if(this.state.passwordIsValid && this.state.usernameIsValid){
        Auth.signIn(this.state.username,this.state.password)
          .then(user => {

            /* If user needs to set new password this will automatically set old
               password as a new password and after that tries to log user in. */

            if(user.challengeName === "NEW_PASSWORD_REQUIRED"){
              user.completeNewPasswordChallenge(this.state.password).then(s => {
                this.setState({loggingSucceeded:false});
                Auth.signIn(this.state.username,this.state.password).then(s => {
                  console.log(user.username+" logged in!");
                  this.setState({loggingSucceeded:true});
                }).catch(e => {this.setState({loggingFailed:true});});
              }).catch(err => this.setState({loggingSucceeded:false}));
            }
            else{
                console.log(user.username+" logged in!");
                this.setState({loggingSucceeded:true});
            }
        })
        .catch(e => {
          this.setState({loggingFailed:true});
        });
      }
      else{
        this.setState({loggingFailed:true});
      }
  }

  /*
  This method implements username validation. This only checks that username is
  not too short or too long. Lenghts are read from config.js file.
  */
  changeUsername = (event) => {
    /* Implements validation of username */
    if(event.target.value.length >= config.login.USERNAME_MIN_LENGTH
      && event.target.value.length <= config.login.USERNAME_MAX_LENGTH){
      this.setState({username: event.target.value, usernameIsValid: true });
    }
    else{
      if(event.target.value.length === 0){
        this.setState({username: event.target.value, usernameIsValid: true });
      }
      else{
        this.setState({username: event.target.value, usernameIsValid: false });
      }
    }
  }

  /*
  This method implements password validation. This only checks that password is
  not too short or too long. Lenghts are read from config.js file.
  */
  changePassword = (event) => {
    if(event.target.value.length >= config.login.PASSWORD_MIN_LENGTH
      && event.target.value.length <= config.login.PASSWORD_MAX_LENGTH){
      this.setState({password: event.target.value, passwordIsValid: true });
    }
    else{
      if(event.target.value.length === 0){
        this.setState({password: event.target.value, passwordIsValid: true });
      }
      else{
        this.setState({password: event.target.value, passwordIsValid: false });
      }
    }
  }


  render(){

    /* Styles for the input box borders. */
    var passwordBorderStyle = {
      'borderStyle': 'solid solid solid solid',
      'borderColor': 'black',
    };
    var usernameBorderStyle = {
      'borderStyle': 'solid solid solid solid',
      'borderColor': 'black',
    };

    /* Changes input box border colors to the red when they are not valid. */
    if(!this.state.passwordIsValid){
      passwordBorderStyle = {
        'borderStyle': 'solid solid solid solid',
        'borderColor': 'red',
      };
    }
    if(!this.state.usernameIsValid){
      usernameBorderStyle = {
        'borderStyle': 'solid solid solid solid',
        'borderColor': 'red',
      };
    }

    return (
      <div>
        {this.state.loggingFailed && <div> Väärä käyttäjätunnus tai salasana!</div>}
        <form onSubmit={this.login}>
          Käyttäjänimi: <input className="input" style={usernameBorderStyle} value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
          Salasana: <input className="input" style={passwordBorderStyle} value={this.state.password} onChange={this.changePassword} type="password" name="password" required />
          <input type="submit" value="Kirjaudu" />
        </form>
        {this.state.loggingSucceeded && <Redirect to="/profile" />}


      </div>

    )
  }
}
