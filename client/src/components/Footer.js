import React from 'react';
import { NavLink } from 'react-router-dom'

const Footer = () => (
  <div className="footer">
    <p>Here's some test links to test navigation in this app:</p>
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/login">Login</NavLink></li>
      <li><NavLink to="/register">Register</NavLink></li>
      <li><NavLink to="/profile">Profile</NavLink></li>
    </ul>
  </div>
);

export default Footer;