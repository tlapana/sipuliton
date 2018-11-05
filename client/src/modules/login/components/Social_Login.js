/*
  This file handles social logins. It covers both facebook and google.
  It presents the buttons, allows user to log in, authenticates the user 
  and if the user exists, logs them in.
*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../../../styles/login.css';

import { Auth } from "aws-amplify";

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'

import config from "../../../config.js"

//Login for Google accounts
export default class SocialLogin extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded:false,
    };
	
    this.responseFailure = this.responseFailure.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebookSuccess = this.responseFacebookSuccess.bind(this);
  }
  
  
  //What to do in case of successful response from Google
  responseGoogle(response) {
    console.log("DEBUG: RESPONSE FROM GOOGLE ON SUCCESS")
    console.log(response);
    var that = this;
    //const googleID = response.googleId; //Might not need this    
    const token = response.tokenObj.id_token;
    const expires = response.tokenObj.expires_at;
    
    console.log("IMPORTANT DATA:");
    console.log("TOKEN: " + token);
    console.log("EXPIRES: " + expires);

    //Authenticate at Cognito
    Auth.federatedSignIn('google', { token, expires_at : expires }, { name: "USER_NAME" })
      .then(credentials => {
        console.log("Auth.federatedSignIn SUCCESS")
        console.log('get aws credentials', credentials);
        this.setState({loggingSucceeded:true});
        
      }).catch(e => {
          
        //this.setState({loggingFailed:true});
        console.log("Auth.federatedSignIn ERROR")
        console.log(e);
        this.setState({loggingFailed:true});
      });
      
    
    
  }
  
  //What to do in case of successful response from Facebook
  responseFacebookSuccess(response) {
    console.log("DEBUG: RESPONSE FROM FACEBOOK ON SUCCESS")
    console.log(response);
    
    const token = response.accessToken;
    const expires = response.expiresIn;
    
    console.log("IMPORTANT DATA:");
    console.log("TOKEN: " + token);
    console.log("EXPIRES: " + expires)
    
    Auth.federatedSignIn('facebook', { token, expires_at : expires}, { name: "USER_NAME" })
      .then(credentials => {
        console.log("Auth.federatedSignIn SUCCESS")
        console.log('get aws credentials', credentials);
        this.setState({loggingSucceeded:true});
        
      }).catch(e => {
          
        //this.setState({loggingFailed:true});
        console.log("Auth.federatedSignIn ERROR")
        console.log(e);
        this.setState({loggingFailed:true});
      });
    
    
  }
  
  //General failure reaction
  responseFailure(response){
    console.log("DEBUG: RESPONSE ON FAILURE")
    console.log(response);
  }
   
  render() {  

    return (
      <div>
        <GoogleLogin
          clientId={config.google.CLIENT_ID}
          responseType="id_token"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFailure}
        >
          Google+
        </GoogleLogin>
        <FacebookLogin
          appId={config.facebook.APP_ID}
          fields="name,email,picture"
          callback={this.responseFacebookSuccess}
          onFailure={this.responseFailure}
        >
          Facebook
        </FacebookLogin>
      </div>
    );
  }  
}