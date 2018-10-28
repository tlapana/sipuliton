import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
  Button,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Auth } from "aws-amplify";
import GoogleLoginBtn from '/client/src/modules/login/components/Google_Login.js'

export default class Register extends React.Component
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

		this.handleChange = this.handleChange.bind(this);
	}

	validateForm()/*Make sure all fields are okay*/
	{
		const isValid = 
			this.state.username.length > 0 &&
			this.state.mail.length > 0 &&
			this.state.password.length > 6 &&
			this.state.username.length < 50 &&
			this.state.mail.length < 50 &&
			this.state.password.length < 30 &&
			this.state.mail === this.state.retypeMail && 
			this.state.password === this.state.retypePass &&
			this.state.ula.checked;
		return isValid;
	}


	handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [target.name]: value
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
<<<<<<< HEAD
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
		<h2>Rekisterˆidy</h2>
		<form onSubmit={this.handleRegistration}>
		<label>
		K‰ytt‰j‰tunnus:<br>
		<input type="text" name="username" value={this.state.username} onChange={this.handleChange} required/><br>
		Salasana:<br>
		<input type="password" name="password" value={this.state.password} onChange={this.handleChange} required/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass" value={this.state.retypePass} onChange={this.handleChange} required/><br>
		S‰hkˆposti:<br>
		<input type="email" name="mail" value={this.state.mail} onChange={this.handleChange} required/><br>
		S‰hkˆposti uudelleen:<br>
		<input type="email" name="retypemail" value={this.state.retypeMail} onChange={this.handleChange} required/><br>
		<input type="checkbox" name="ula" value={this.state.ula} onChange={this.handleChange} required/>Hyv‰ksyn k‰ytt‰j‰ehdot<br>
		</label>
		<Button type="submit"/>
		</form><br>
		<GoogleLoginBtn/>
		</div>
		)
	}
	render()/*decide which form to show, based on whether there is a 'newUser'*/
=======

	renderConfirmationForm()
	{
		return(
			<div>
				<Form onSubmit={this.handleConfirmation}>
					<FormGroup>
						<Label>Varmistuskoodi:</Label>
						<Input type="text" name="code" value={this.state.code} onChange={this.handleChange} required/>
					</FormGroup>
					<Button type="submit" onClick={() => this.handleConfirmation()} className="btn btn-primary mb-2">Vahvista</Button>
				</Form>
			</div>
		);
	}

	renderForm()
	{
		return (
			<div>
				<h1>Rekister√∂idy</h1>
				<Form onSubmit={this.handleRegistration}>
					<FormGroup>
						<Label>K√§ytt√§j√§tunnus:</Label>
						<Input type="text" name="username" value={this.state.username} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup>
						<Label>	Salasana:</Label>
						<Input type="password" name="password" value={this.state.password} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup>
						<Label>Salasana uudelleen:</Label>
						<Input type="password" name="retypePass" value={this.state.retypePass} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup>
						<Label>S√§hk√∂posti:</Label>
						<Input type="email" name="mail" value={this.state.mail} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup>
						<Label>S√§hk√∂posti uudelleen:</Label>
						<Input type="email" name="retypeMail" value={this.state.retypeMail} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup check>
						<Label check>{' '}
							<Input type="checkbox" name="ula" value={this.state.ula} onChange={this.handleChange} required/>
							Hyv√§ksyn k√§ytt√§j√§ehdot
						</Label>
					</FormGroup>
					<Input type="submit" value="Rekister√∂idy" className="btn btn-primary mb-2"/>
					<Button type="submit" onClick={() => this.handleRegistration()} className="btn btn-primary mb-2">Rekister√∂idy</Button>
				</Form>
			</div>
		);
	}

	render()
>>>>>>> b095e744134bf4df078f82b23ca154919332f6e4
	{
		return (
			this.state.newUser === null
			? this.renderForm()
			: this.renderConfirmationForm()
		);
	}
}
<<<<<<< HEAD
export default Register;
=======

>>>>>>> b095e744134bf4df078f82b23ca154919332f6e4
