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
import SocialLogin from '/client/src/modules/login/components/Social_Login.js' /*Import Google&FB log-in, as used in log-in view*/

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
	validateConfirmationForm()
	{
		return this.state.code.length > 0;
	}
	handleChange(event)/*what happens on form change*/
	{
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({
			[target.name]: value
		});
	}

	handleRegistration = async event =>/*use signUp function to register*/
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

	handleConfirmation = async event =>/*use confirmSignUp to confirm registration and do a sign in with singIn*/
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

	renderConfirmationForm()/*The second form where user enters a confirmation code and proceeds to the profile*/
	{
		return(
			<div id="register">
				<Form onSubmit={this.handleConfirmation}>
					<FormGroup>
						<Label>Varmistuskoodi:</Label>
						<Input type="text" name="code" value={this.state.code} onChange={this.handleChange} required/>
					</FormGroup>
					<Button type="submit" onClick={() => this.handleConfirmation()} disabled={!this.validateConfirmationForm()} className="btn btn-primary mb-2">Vahvista</Button>
				</Form>
			</div>
			{this.state.userHasAuthenticated && <Redirect to="/profile" />}
		);
	}

	renderForm()/*The first form where the user enters info needed for an account*/
	{
		return (
			<div id="register">
				<h2>Rekisteröidy</h2>
				<Form onSubmit={this.handleRegistration}>
					<FormGroup>
						<Label>Käyttäjätunnus:</Label>
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
						<Label>Sähköposti:</Label>
						<Input type="email" name="mail" value={this.state.mail} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup>
						<Label>Sähköposti uudelleen:</Label>
						<Input type="email" name="retypeMail" value={this.state.retypeMail} onChange={this.handleChange} required/>
					</FormGroup>
					<FormGroup check>
						<Label check>{' '}
							<Input type="checkbox" name="ula" value={this.state.ula} onChange={this.handleChange} required/>
							Hyväksyn käyttäjäehdot
						</Label>
					</FormGroup>
					<Button type="submit" onClick={() => this.handleRegistration()} disabled={!this.validateForm()} className="btn btn-primary mb-2">Rekisteröidy</Button>
				</Form><br>
				<SocialLogin/>
			</div>
		);
	}

	render()/*decide which form to show, based on whether there is a 'newUser'*/
	{
		return (
			this.state.newUser === null
			? this.renderForm()
			: this.renderConfirmationForm()
		);
	}
}
export default Register;