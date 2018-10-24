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
    <h2>Login</h2>
    <LoginForm/>
    <div>Haven't registered yet?' </div>
    <NavLink tag={Link} to='/register'>
      Register now!
    </NavLink>
  </div>
);



export default Login;
