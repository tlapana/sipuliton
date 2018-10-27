/* global gapi */
import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.css'

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

//Login for Google accounts
class GoogleLoginBtn extends React.Component {
  
    onSignIn(googleUser) {
        console.log("user signed in"); // plus any other logic here
    }

    renderGoogleLoginButton() {
        console.log('rendering google signin button');
        gapi.signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': this.onSignIn
        })
    }

    componentDidMount() {
        window.addEventListener('google-loaded',this.renderGoogleLoginButton);
    }

    render() {
        return (
            <div class="g-signin2" data-onsuccess="onSignIn">Kirjaudu Googlella</div>
        );
    }

  
}

export default GoogleLoginBtn;