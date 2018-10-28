/* global gapi */
import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.css'

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

import GoogleLogin from 'react-google-login';

import config from "../../../config.js"

//Login for Google accounts
class GoogleLoginBtn extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggingFailed: false,
      loggingSucceeded:false,
    };
    
  }
  
  //Currently does both success and failure. Need to be split into two later
  responseGoogleSuccess(response){
    console.log("DEBUG: RESPONSE FROM GOOGLE ON SUCCESS")
    const tokenObj = response.tokenObj;
    const googleID = response.googleId;
    //const token = tokenObj.access_token;
    const token = tokenObj.id_token;
    const expires_at = tokenObj.expires_at;
    var profile = response.profileObj; //Get user profile for checking
    const user = {
        email: profile.email,
        name: profile.name
    };
    console.log("RESPONSE");
    console.log(response);
    console.log("TOKEN")
    console.log(tokenObj);
    console.log("token: " + token);
    console.log("expires: " + expires_at);
    console.log(profile);
    
    Auth.federatedSignIn('google', { token, expires_at}, { name: user.name })
      .then(credentials => {
        console.log("Auth.federatedSignIn SUCCESS")
        console.log('get aws credentials', credentials);
        //this.setState({loggingSucceeded:true});
      }).catch(e => {
        console.log("Auth.federatedSignIn ERROR")
        console.log(e);
      });
    
  }
    
  responseGoogleFailure(response){
    console.log("DEBUG: RESPONSE FROM GOOGLE ON FAILURE")
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
          onSuccess={this.responseGoogleSuccess}
          onFailure={this.responseGoogleFailure}
        >
          Kirjaudu käyttäen Google tiliä
        </GoogleLogin>
        {this.state.loggingFailed && <Redirect to="/profile" />}
      </div>
    );
  }  
}

export default GoogleLoginBtn;