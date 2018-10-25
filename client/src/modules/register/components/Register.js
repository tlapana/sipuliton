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
	constructor(props)/*construct the default state on first page load*/
	{
		super(props);

		this.state = {
		isLoading: false,
		username: "",
		mail: "",
		password: "",
		retypeMail: "",
		retypePass: "",
		newUser: null
		};
	}
	handleRegistration(event)
	{
		/* do the registration, maybe send the data in other function */
		console.log('Registration sent');
	}
	validateForm()/*Make sure all fields are okay*/
	{
		return
		(
		this.state.username.length > 0 &&
		this.state.mail.length > 0 &&
		this.state.password.length > 6 &&
		this.state.username.length < 50 &&
		this.state.mail.length < 50 &&
		this.state.password.length < 30 &&
		this.state.mail === this.state.retypeMail
		this.state.password === this.state.retypePass
		this.state.ula.checked
		);
	}
	handleChange = event =>
	{
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	handleSubmit = async event =>
	{
		event.preventDefault();
		this.setState({ isLoading: true });
		this.setState({ newUser: "test" });
		this.setState({ isLoading: false });
	}

	renderConfirmationForm()
	{
		return(
		
		)
	}
	renderForm()
	{
		return (
		<h1>Rekisteröidy</h1>
		<form onSubmit={this.handleRegistration}>
		<label>
		Käyttäjätunnus:<br>
		<input type="text" name="username" value={this.state.username} onChange={this.changeUsername} required/><br>
		Salasana:<br>
		<input type="password" name="password" value={this.state.password} onChange={this.changePass} required/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass" value={this.state.retypePass} onChange={this.changeRetypePass} required/><br>
		Sähköposti:<br>
		<input type="email" name="mail" value={this.state.mail} onChange={this.changeMail} required/><br>
		Sähköposti uudelleen:<br>
		<input type="email" name="retypemail" value={this.state.retypeMail} onChange={this.changeRetypeMail} required/><br>
		<input type="checkbox" name="ula" value={this.state.ula} onChange={this.changeUla} required/>Hyväksyn käyttäjäehdot<br>
		</label>
		<input type="submit"/>
		</form>
		)
	}
	render()
	{
		return (
			{this.state.newUser === null
			? this.renderForm()
			: this.renderConfirmationForm()}
		);
	}
}