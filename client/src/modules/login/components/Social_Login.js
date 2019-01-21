/*
  This file handles social logins. It covers both facebook and google.
  It presents the buttons, allows user to log in, authenticates the user 
  and if the user exists, logs them in.
*/

import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../../styles/login.css';

import { Auth } from "aws-amplify";

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import LocalizedStrings from 'react-localization';

import config from "../../../config.js"

//Login for Google accounts
export default class SocialLogin extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded: false,
    };
	
    this.responseFailure = this.responseFailure.bind(this);
    this.signInGoogle = this.signInGoogle.bind(this);
    this.signInFacebook = this.signInFacebook.bind(this);
  }
  
  componentDidMount() {
    //First, check that FB script is avaible
    if (!window.FB) this.createScriptFB();
    
    //Check that Google script is avaible
    const ga = window.gapi && window.gapi.auth2 ? window.gapi.auth2.getAuthInstance() : null;
    if (!ga) this.createScriptGoogle();
  }
  
  //Login with Google
  signInGoogle(response) {
    const ga = window.gapi.auth2.getAuthInstance();
    ga.signIn().then(
      googleUser => {
        this.getAWSCredentialsGoogle(googleUser);
      },
      error => {
        console.log(error);
      }
    );
  }
  
  //Getting credentuals with google user
  async getAWSCredentialsGoogle(googleUser) {
    const { id_token, expires_at } = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    let user = {
      email: profile.getEmail(),
      name: profile.getName()
    };
     
    const credentials = await Auth.federatedSignIn(
      'google',
      { token: id_token, expires_at },
        user
      );
    this.setState({
       loggingSucceeded: true
    });
  }
  
  //Login with Facebook
  signInFacebook(response) {
    console.log("DEBUG: Social_Login.js signInFacebook() entered")
    const fb = window.FB;
    fb.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.getAWSCredentialsFacebook(response.authResponse);
      } else {
        fb.login(
          response => {
            if (!response || !response.authResponse) {
              return;
            }
            this.getAWSCredentialsFacebook(response.authResponse);
          },
          {
            // the authorized scopes
            scope: 'public_profile,email'
          }
        );
      }
    });   
  }
  
  //Getting credentuals with facebook user
  getAWSCredentialsFacebook(response) {
    const { accessToken, expiresIn } = response;
    const date = new Date();
    const expires_at = expiresIn * 1000 + date.getTime();
    if (!accessToken) {
      return;
    }

    const fb = window.FB;
    fb.api('/me', { fields: 'name,email' }, response => {
    const user = {
      name: response.name,
      email: response.email
    };
               
    Auth.federatedSignIn('facebook', { token: accessToken, expires_at }, user)
      .then(credentials => {
        console.log(credentials);
        return Auth.currentAuthenticatedUser();
      }).then(user => {
          // If success, the user object you passed in Auth.federatedSignIn
          console.log(user);
          this.setState({
            loggingSucceeded: true
          });
      });
    });
  }
  
  //General failure reaction
  responseFailure(response){
    console.log("DEBUG: RESPONSE ON FAILURE")
    console.log(response);
  }
  
  //For Facebook script
  createScriptFB() {
    // load the sdk
    console.log("DEBUG Social_Login.js createScriptFB entered")
    window.fbAsyncInit = this.fbAsyncInit;
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = this.initFB;
    document.body.appendChild(script);
    console.log("DEBUG Social_Login.js createScriptFB out")
  }
  
   initFB() {
    const fb = window.FB;
    console.log('DEBUG Social_Login.js initFB FB SDK inited');
  }

  //FB initialization
  fbAsyncInit() {
    // init the fb sdk client
    const fb = window.FB;
    fb.init({
      appId   : config.facebook.APP_ID,
      cookie  : true,
      xfbml   : true,
      version : 'v2.11'
    });
  }
  
  //For Google script
  createScriptGoogle() {
    // load the Google SDK
    console.log("DEBUG Social_Login.js createScriptGoogle entered")
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.onload = this.initGapi;
    document.body.appendChild(script);
    console.log("DEBUG Social_Login.js createScriptGoogle out")
  }
  
  
  //Google API initialization
  initGapi() {
    // init the Google SDK client
    console.log("DEBUG Social_Login.js initGapi entered")
    const g = window.gapi;
    g.load('auth2', function() {
      g.auth2.init({
        client_id: config.google.CLIENT_ID,
        // authorized scopes
        scope: 'profile email openid'
      });
    });
    console.log("DEBUG Social_Login.js initGapi out")
  }
   
  render() {
    let strings = new LocalizedStrings({
      en:{
        fbLogin:'Login with Facebook',
        googleLogin: 'Login with Google',
      },
      fi: {
        fbLogin: 'Facebook kirjautuminen',
        googleLogin: 'Google kirjautuminen',
      }
    });
    strings.setLanguage(this.props.language);
    
    
    if(this.state.loggingSucceeded)    {
      return <Redirect to={"/" + this.props.language + "/profile"} />
    }
    else {
      
      return (
        <div>
          <button onClick={this.signInGoogle}>{/*<FontAwesomeIcon icon={["fab", "google"]}></FontAwesomeIcon>*/}
            <img className="logo-icon" src={require("../../../resources/google_logo.svg")} />
            <span>{strings.googleLogin}</span>e
          </button>
          <button onClick={this.signInFacebook}>
            <FontAwesomeIcon className="logo-icon" icon={["fab", "facebook"]} />
            {strings.fbLogin}
          </button>  
        </div>
        /* 
        //These are the old buttons
        <div>
          <GoogleLogin
            clientId={config.google.CLIENT_ID}
            responseType="id_token"
            className="google-login-btn"
            onSuccess={this.signInGoogle}
            onFailure={this.responseFailure}
          >
            <img className="logo-icon" src={require("../../../resources/google_logo.svg")} />
            <span>{strings.googleLogin}</span>
          </GoogleLogin>
          <FacebookLogin
            appId={config.facebook.APP_ID}
            fields="name,email,picture"
            cssClass="facebook-login-btn"
            icon={<FontAwesomeIcon className="logo-icon" icon={["fab", "facebook"]} />}
            textButton={strings.fbLogin}
            callback={this.signInFacebook}
            onFailure={this.responseFailure}
          >
          </FacebookLogin>
        </div>
        */
      );
    }
  }  
}