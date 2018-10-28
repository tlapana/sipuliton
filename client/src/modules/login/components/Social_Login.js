/* global gapi */
import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.css'

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'

import config from "../../../config.js"

//Login for Google accounts
export default class SocialLogin extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggingFailed: false,
      loggingSucceeded:false,
    };
  }
  
  
  //What to do in case of successful authorization from Google
  responseGoogle(response) {
    console.log("DEBUG: RESPONSE FROM GOOGLE ON SUCCESS")
    console.log(response);
    var that = this;
    //const googleID = response.googleId; //Might not need this    
    const token = response.tokenObj.access_token;
    const expires = response.tokenObj.expires_at;
    
    console.log("IMPORTANT DATA:");
    console.log("TOKEN: " + token);
    console.log("EXPIRES: " + expires)
    
    //Authenticate at Cognito
    Auth.federatedSignIn('google', { token, expires_at : expires}, { name: "USER_NAME" })
      .then(credentials => {
        console.log("Auth.federatedSignIn SUCCESS")
        console.log('get aws credentials', credentials);
        //this.setState({loggingSucceeded:true});
      }).catch(e => {
          
        //this.setState({loggingFailed:true});
        console.log("Auth.federatedSignIn ERROR")
        console.log(e);
      });
    
  }
    

  
  //What to do in case of successful authorization from Facebook
  responseFacebookSuccess(response) {
    console.log("DEBUG: RESPONSE FROM FACEBOOK ON SUCCESS")
    console.log(response);
    
    const token = response.accessToken;
    const expires = response.expiresIn;
    
    console.log("IMPORTANT DATA:");
    console.log("TOKEN: " + token);
    console.log("EXPIRES: " + expires)
    
    //Authenticate at Cognito
    Auth.federatedSignIn('google', { token, expires_at : expires}, { name: "USER_NAME" })
      .then(credentials => {
        console.log("Auth.federatedSignIn SUCCESS")
        console.log('get aws credentials', credentials);
        //this.setState({loggingSucceeded:true});
      }).catch(e => {
          
        //this.setState({loggingFailed:true});
        console.log("Auth.federatedSignIn ERROR")
        console.log(e);
      });
    
  }
  
  //General failure reaction
  responseFailure(response){
    console.log("DEBUG: RESPONSE ON FAILURE")
    console.log(response);
    this.setState({loggingFailed:true});
  }
  
  

  render() {  

    const federated = {
    google_client_id: config.google.CLIENT_ID,
    facebook_app_id: '',
    amazon_client_id: ''
};
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
          onClick={this.facebookClicked}
          callback={this.responseFacebookSuccess}
          onFailure={this.responseFailure}
        >
          Facebook
        </FacebookLogin>
        {this.state.loggingFailed && "Kirjautuminen Epäonnistui"}
      </div>
    );
  }  
}