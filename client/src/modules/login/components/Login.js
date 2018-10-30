import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';
import styles from '../../../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoginForm from './Login_Form.js'
import SocialLogin from './Social_Login.js'

const Login = () => (
  <div id="login">
    <h2>Kirjautuminen</h2>
    <LoginForm/> <br/>
    <SocialLogin/> <br/>
    <div>Etkö ole vielä rekisteröitynyt? </div>
    <NavLink tag={Link} to='/register'>
      Rekisteröidy nyt!
    </NavLink>
  </div>
);



export default Login;
