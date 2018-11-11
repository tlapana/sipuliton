/*
This file implements regular login to the application.
*/

import React from 'react';
import {
  Button,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import config from "../../../config.js"
/* Localization */
import LocalizedStrings from 'react-localization';


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
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        username:"Username:",
        password:"Password: ",
        login:"Login",
      },
      fi: {
        username:"Käyttäjänimi:",
        password:"Salasana: ",
        login:"Kirjaudu",
      }
    });
    strings.setLanguage(this.props.language);

    return (
      <div>
        {this.state.loggingFailed && <div>{strings.wrongusername}</div>}
        <Form onSubmit={this.login}>
          <FormGroup>
            <Label>{strings.username}</Label>
            <Input className={!this.state.usernameIsValid ? 'invalid' : ''} value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
          </FormGroup>
          <FormGroup>
            <Label>{strings.password}</Label>
            <Input className={!this.state.passwordIsValid ? 'invalid' : ''} value={this.state.password} onChange={this.changePassword} type="password" name="password" required />
          </FormGroup>

          <Input type="submit" value={strings.login} className="btn main-btn big-btn mb-2" /> 
        </Form>
        {this.state.loggingSucceeded && <Redirect to="/profile" />}
      </div>

    )
  }
}
