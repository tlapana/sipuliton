/* This file has mostly the same functions as SocialLogin, but there is additional functionality to send user information
back to Register class, which then finishes the registration with social media accounts*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../../styles/login.css';

import { Auth } from "aws-amplify";

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import LocalizedStrings from 'react-localization';

import config from "../../../config.js"

//Login for Google accounts
export default class SocialRegister extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
	    regCredentials: "abcd",
      loggingFailed: false,
      loggingSucceeded: false,
	    allowSending: false,
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
        this.setState({
			regCredentials: [response.profileObj, "google"],
			loggingSucceeded:true
			});
		this.sendToRegister();
        
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
        this.setState({
			regCredentials: [response, "facebook"],
			loggingSucceeded:true
			});
		this.sendToRegister();
        
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
  
  sendToRegister = () => {
		this.props.callback(this.state.regCredentials);
	}
  
  render() {
    let strings = new LocalizedStrings({
      en:{
        fbLogin:'Register with Facebook',
        googleLogin: 'Register with Google',
      },
      fi: {
        fbLogin: 'Facebook-rekisteröityminen',
        googleLogin: 'Google-rekisteröityminen',
      }
    });
    strings.setLanguage(this.props.parentLanguage);
    return (
      <div>
        <GoogleLogin
          clientId={config.google.CLIENT_ID}
          responseType="id_token"
          className="google-login-btn"
          onSuccess={this.responseGoogle}
		  onComplete={this.sendToRegister}
          onFailure={this.responseFailure}
        >
          {/*<FontAwesomeIcon icon={["fab", "google"]}></FontAwesomeIcon>*/}
          <img className="logo-icon" src={require("../../../resources/google_logo.svg")} />
          <span>{strings.googleLogin}</span>
        </GoogleLogin>
        <FacebookLogin
          appId={config.facebook.APP_ID}
          fields="name,email,picture"
          cssClass="facebook-login-btn"
          icon={<FontAwesomeIcon className="logo-icon" icon={["fab", "facebook"]} />}
          textButton={strings.fbLogin}
          callback={this.responseFacebookSuccess}
		  onSuccess={this.sendToRegister}
          onFailure={this.responseFailure}
        >
        </FacebookLogin>
      </div>
    );
  }  
}