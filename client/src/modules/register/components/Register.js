import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';
import styles from './styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Auth } from "aws-amplify";
import GoogleLoginBtn from '/client/src/modules/login/components/Google_Login.js'

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
	handleRegistration = async event =>
	{
		event.preventDefault();
		this.setState({ isLoading: true });
		try {
			const newUser = await Auth.signUp({
				username: this.state.username,
				password: this.state.password,
				mail: this.state.mail
			});
			this.setState({
				newUser
			});
		} catch (e) {
			alert(e.message);
		}
		this.setState({ isLoading: false });
		}
	handleConfirmation = async event =>
	{
		event.preventDefault();
		this.setState({ isLoading: true });
		try {
			await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
			await Auth.signIn(this.state.username, this.state.password);
			this.props.userHasAuthenticated(true);
			this.props.history.push("/");
		} catch (e) {
			alert(e.message);
			this.setState({ isLoading: false });
		}
	}
	renderConfirmationForm()/*Confirmation form to be displayed after submitting the info*/
	{
		return(
			<form onSubmit={this.handleConfirmation}>
			Varmistuskoodi:<br>
			<input type="text" name="code" value={this.state.code} onChange={this.handleChange} required/><br>
			<input type="submit"/>
			</form>
			{this.state.userHasAuthenticated && <Redirect to="/profile" />}		
		)
	}
	renderForm()/*The registration form and a link to the Google log-in*/
	{
		return (
		<div id="register">
		<h2>Rekisteröidy</h2>
		<form onSubmit={this.handleRegistration}>
		<label>
		Käyttäjätunnus:<br>
		<input type="text" name="username" value={this.state.username} onChange={this.handleChange} required/><br>
		Salasana:<br>
		<input type="password" name="password" value={this.state.password} onChange={this.handleChange} required/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass" value={this.state.retypePass} onChange={this.handleChange} required/><br>
		Sähköposti:<br>
		<input type="email" name="mail" value={this.state.mail} onChange={this.handleChange} required/><br>
		Sähköposti uudelleen:<br>
		<input type="email" name="retypemail" value={this.state.retypeMail} onChange={this.handleChange} required/><br>
		<input type="checkbox" name="ula" value={this.state.ula} onChange={this.handleChange} required/>Hyväksyn käyttäjäehdot<br>
		</label>
		<Button type="submit"/>
		</form><br>
		<GoogleLoginBtn/>
		</div>
		)
	}
	render()/*decide which form to show, based on whether there is a 'newUser'*/
	{
		return (
			{this.state.newUser === null
			? this.renderForm()
			: this.renderConfirmationForm()}
		);
	}
}
export default Register;