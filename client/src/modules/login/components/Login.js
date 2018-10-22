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



const Login = () => (
  <div id="login">
    <h2>Login</h2>
    <form action="">
     Username: <input class="input" type="text" name="username"/><br/>
     Password: <input class="input" type="password" name="password"/><br/>
     <input type="submit" value="Login" />
    </form>
    <div>Haven't registered yet?' </div>
    <NavLink tag={Link} to='/register'>
      Register now!
    </NavLink>
  </div>
);

export default Login;
