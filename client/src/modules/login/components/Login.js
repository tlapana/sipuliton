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

const Login = () => (
  <div id="login">
    <h2>Kirjautuminen</h2>
    <LoginForm/>
    <div>Etkö ole vielä rekisteröitynyt? </div>
    <NavLink tag={Link} to='/register'>
      Rekisteröidy nyt!
    </NavLink>
    <NavLink tag={Link} to='/forgot-password'>
      Unohditko salasanan?
    </NavLink>
  </div>
);



export default Login;
