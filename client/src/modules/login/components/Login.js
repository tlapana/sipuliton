import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink, } from 'reactstrap';
import '../../../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoginForm from './Login_Form.js'
import SocialLogin from './Social_Login.js'

const Login = () => (
  <div id="login">
    <h2>Kirjautuminen</h2>
    <LoginForm/> <br/>
    <SocialLogin/> <br/>
    <span>Etkö ole vielä rekisteröitynyt? </span>
    <Link tag={Link} to='/register'>
      Rekisteröidy nyt!
    </Link>
    <br/>
    <Link tag={Link} to='/forgot-password'>
      Unohditko salasanan?
    </Link>
  </div>
);



export default Login;
