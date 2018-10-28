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
      //this.setState({loggingSucceeded:true});
      var tokenId = response.tokenId;
      var user = response.profileObj; //Get user profile
      console.log(user);
      console.log("tokenId: " + tokenId);
      
      // Add the Google access token to the Cognito credentials login map.
      Auth.config.credentials = new Auth.CognitoIdentityCredentials({
        IdentityPoolId: 'IDENTITY_POOL_ID',
        Logins: {
           'accounts.google.com': tokenId
        }
      });
      
      // Obtain AWS credentials
      Auth.config.credentials.get(function(){
        console.log(user.name + " logged in!");
        this.setState({loggingSucceeded:true});
      });
      
    }
    
    responseGoogleFailure(response){
      console.log("DEBUG: RESPONSE FROM GOOGLE ON FAILURE")
      console.log(response);
    }
    
    //Copied from the login_form
    login = event =>{
      event.preventDefault();
      /* Implement configuration of Authorization to cogniton*/
      Auth.signIn(this.state.username,this.state.password)
        .then(user => {
          if(user.challengeName == "NEW_PASSWORD_REQUIRED"){
            user.completeNewPasswordChallenge(this.state.password).then(s => {
              console.log(s);
            }).catch(err => console.log(err));
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

    render() {
      
        return (
            <div>
              <GoogleLogin
                clientId="1007417390749-o1tbmd4dfnn4ak51uh1trqimtgp15k0v.apps.googleusercontent.com"
                buttonText='Kirjaudu käyttäen Google tiliä '
                responseType="id_token"
                onSuccess={this.responseGoogleSuccess}
                onFailure={this.responseGoogleFailure}
              />
            </div>
        );
    }

  
}

export default GoogleLoginBtn;