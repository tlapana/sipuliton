import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';

import { Auth } from "aws-amplify";
class Register extends React.Component
{
	
	handleRegistration(event)
	{
		/* do the registration, maybe send the data in other function */
		console.log('Registration sent');
	}
	render()
	{
		return (
		<h1>Rekisteröidy</h1>
		<form onSubmit={this.handleRegistration}>
		<label>
		Käyttäjätunnus:<br>
		<input type="text" name="username" value={this.state.username} onChange={this.changeUsername}/><br>
		Salasana:<br>
		<input type="password" name="password" value={this.state.password} onChange={this.changePass}/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass" value={this.state.retypePass} onChange={this.changeRetypePass}/><br>
		Sähköposti:<br>
		<input type="email" name="mail" value={this.state.mail} onChange={this.changeMail}/><br>
		Sähköposti uudelleen:<br>
		<input type="email" name="retypemail" value={this.state.retypeMail} onChange={this.changeRetypeMail}/><br>
		<input type="radio" name="ula" value={this.state.ula} onChange={this.changeUla}/>Hyväksyn käyttäjäehdot<br>
		</label>
		<input type="submit"/>
		</form>
		)
	}
}