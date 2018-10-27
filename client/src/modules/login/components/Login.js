import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';
import styles from './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoginForm from './Login_Form.js'
import GoogleLoginBtn from './Google_Login.js'

const Login = () => (
  <div id="login">
    <h2>Kirjautuminen</h2>
    <LoginForm/> <br/>
    <GoogleLoginBtn/>
    <div>Etkö ole vielä rekisteröitynyt? </div>
    <NavLink tag={Link} to='/register'>
      Rekisteröidy nyt!
    </NavLink>
  </div>
);



export default Login;
