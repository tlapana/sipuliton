/* global gapi */
import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.css'

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

import GoogleLogin from 'react-google-login';

//Login for Google accounts
class GoogleLoginBtn extends React.Component {
  
   constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded:false,
    };
  }
  
    //Currently does both success and failure. Need to be split into two later
    responseGoogleSuccess(response){
      console.log("DEBUG: RESPONSE FROM GOOGLE ON SUCCESS")
      console.log(response);
      console.log(response.tokenId);
    }
    
    responseGoogleFailure(response){
      console.log("DEBUG: RESPONSE FROM GOOGLE ON FAILURE")
      console.log(response);
    }

    render() {
        return (
            <GoogleLogin
              clientId="1007417390749-o1tbmd4dfnn4ak51uh1trqimtgp15k0v.apps.googleusercontent.com"
              buttonText='Kirjaudu käyttäen Google tiliä '
              responseType="id_token"
              onSuccess={this.responseGoogleSuccess}
              onFailure={this.responseGoogleFailure}
            />
        );
    }

  
}

export default GoogleLoginBtn;