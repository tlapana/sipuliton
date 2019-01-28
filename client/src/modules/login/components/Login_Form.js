/*
This file implements regular login to the application.
*/

import React from 'react';
import {
	Form,
	FormGroup,
	Label,
} from 'reactstrap';

import { Auth, API } from "aws-amplify";
import { Redirect, withRouter } from "react-router-dom";
import config from "../../../config.js"
import commonComponents from '../../common'

/* Localization */
import LocalizedStrings from 'react-localization';


class Login_Form extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded:false,
      passwordIsValid: true,
      usernameIsValid: true,
      isLoading: false,
    };

    this.fetchProfile = this.getUserId.bind(this);
  }

  login = event =>{

   /* Logs user in, if password or username
      is not valid login will automatically fail. */

      event.preventDefault();
      this.setState({ loggingFailed: false, isLoading: true });
      if (this.state.passwordIsValid && this.state.usernameIsValid && !this.state.isLoading) {
        Auth.signIn(this.state.username, this.state.password)
          .then(user => {

            /* If user needs to set new password this will automatically set old
               password as a new password and after that tries to log user in. */

            if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
              user.completeNewPasswordChallenge(this.state.password).then(s => {
                this.setState({ loggingSucceeded: false, isLoading: false });
                Auth.signIn(this.state.username, this.state.password).then(s => {
                  console.log(user.username + " logged in with cognito!");
                  this.getUserId(user);
                }).catch(e => {this.setState({ loggingFailed: true, isLoading: false });});
              }).catch(err => this.setState({ loggingSucceeded: false, isLoading: false }));
            }
            else {
              console.log(user.username + " logged in with cognito!");
              this.getUserId(user);
            }
        })
        .catch(e => {
          this.setState({ loggingFailed: true, isLoading: false });
        });
      }
      else{
        this.setState({ loggingFailed: true, isLoading: false });
      }
  }

  getUserId(cognitoUser) {
    if (!this.state.loading) {
      this.setState({ isLoading: true });
    }
    const init = { queryStringParameters: {} }
    API.get('api', '/user/getByCognito', init)
      .then((responseJson) => {
        if (responseJson.user_id == null) {
          this.setState({ isLoading: false, loggingFailed: true, loggingSucceeded: false });
          console.error('profile did not return user_id');
          Auth.signOut()
            .then(data => this.setState({ isLoading: false, loggingFailed: true, loggingSucceeded: false }))
            .catch(err => { console.log(err); this.setState({ isLoading: false, loggingFailed: true, loggingSucceeded: false }); });
        }
        else {
          this.props.loggedIn(responseJson.user_id);
          //this.setState({ loggingSucceeded: true, loggingFailed: false, isLoading: true });
          this.props.history.push("/" + this.props.language + "/profile/" + responseJson.user_id);
        }
      })
      .catch((error) => {
        console.error(error);
        Auth.signOut()
          .then(data => this.setState({ isLoading: false, loggingFailed: true, loggingSucceeded: false }))
          .catch(err => { console.log(err); this.setState({ isLoading: false, loggingFailed: true, loggingSucceeded: false }); });
      });
  }

  cognitoLogout() {
    
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


  render() {
    const { VInput, ErrorBlock } = commonComponents;
    let strings = new LocalizedStrings({
      en:{
        username: "Username:",
        password: "Password: ",
        login: "Login",
        loggingIn: "Logging in...",
        loginfailed: "Incorrect username or password",
      },
      fi: {
        username: "Käyttäjänimi:",
        password: "Salasana: ",
        login: "Kirjaudu",
        loggingIn: "Kirjaudutaan...",
        loginfailed: "Virheellinen käyttäjänimi tai salasana",
      }
    });
    strings.setLanguage(this.props.language);
    let loginBtnStr = this.state.isLoading ? strings.loggingIn : strings.login;

    return (
      <div>
        <ErrorBlock hidden={!this.state.loggingFailed} errormsg={strings.loginfailed} />
        <Form onSubmit={this.login}>
          <FormGroup>
            <Label>{strings.username}</Label>
            <VInput isValid={this.state.usernameIsValid} value={this.state.username} onChange={this.changeUsername} type="text" name="username" required autoFocus={true} />
          </FormGroup>
          <FormGroup>
            <Label>{strings.password}</Label>
            <VInput isValid={this.state.passwordIsValid} value={this.state.password} onChange={this.changePassword} type="password" name="password" required />
          </FormGroup>

          <VInput type="submit" value={loginBtnStr} isValid={!this.state.isLoading} className="main-btn big-btn max-w-10" />
        </Form>
        {this.state.loggingSucceeded && <Redirect to={"/" + this.props.language + "/profile"} />}
      </div>
    );
  }
}


const Login_FormWithRouter = withRouter(Login_Form);
export default Login_FormWithRouter;
