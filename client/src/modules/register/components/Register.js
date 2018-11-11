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

import config from "../../../config.js"

/* Localization */
import LocalizedStrings from 'react-localization';

export default class Register extends React.Component {
	constructor(props) {
		/*construct the default state on first page load*/
		super(props);

		this.state = {
			isLoading: false,
			username: "",
			mail: "",
			password: "",
			retypeMail: "",
			retypePass: "",
			newUser: null,
			ula: false,

			usernameValid: true,
			mailValid: true,
			retypeMailValid: true,
			passwordValid: true,
			retypePassValid: true,
		};

		this.onUsernameChanged = this.onUsernameChanged.bind(this);
		this.onMailChanged = this.onMailChanged.bind(this);
		this.onRetypeMailChanged = this.onRetypeMailChanged.bind(this);
		this.onPasswordChanged = this.onPasswordChanged.bind(this);
		this.onRetypePassChanged = this.onRetypePassChanged.bind(this);
		this.onUlaChanged = this.onUlaChanged.bind(this);
		this.validateForm = this.validateForm.bind(this);

		this.handleRegistration = this.handleRegistration.bind(this);
		this.renderConfirmationForm = this.renderConfirmationForm.bind(this);
		this.renderForm = this.renderForm.bind(this);
	}

	validateForm() {
		/*Make sure all fields are okay*/
		const isValid = (
			this.state.usernameValid && this.state.username.length > 0 && 
			this.state.mailValid && this.state.mail.length > 0 && 
			this.state.retypeMailValid && this.state.retypeMail.length > 0 && 
			this.state.passwordValid && this.state.password.length > 0 && 
			this.state.retypePassValid && this.state.retypePass.length > 0 && 
			this.state.ula
		);
		return isValid;
	}

	onUsernameChanged(e) {
		const username = e.target.value;
		const isValid = (
			username != null && 
			username.length >= config.login.USERNAME_MIN_LENGTH && 
			username.length <= config.login.USERNAME_MAX_LENGTH
		);
		this.setState({
			username: username,
			usernameValid: isValid,
		});
	}
	
	onMailChanged(e) {
		const mail = e.target.value;
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		const isValid = (
			mail != null && 
			mail.length >= config.login.EMAIL_MIN_LENGTH && 
			mail.length <= config.login.EMAIL_MAX_LENGTH && 
			re.test(mail)
		);
		const retypeMailValid = (mail === this.state.retypeMail);
		this.setState({
			mail: mail,
			mailValid: isValid,
			retypeMailValid: retypeMailValid,
		});
	}

	onRetypeMailChanged(e) {
		const retypeMail = e.target.value;
		const isValid = (retypeMail === this.state.mail);
		this.setState({
			retypeMail: retypeMail,
			retypeMailValid: isValid,
		});
	}

	onPasswordChanged(e) {
		const password = e.target.value;
		const reLowerCase = /[a-z]/;
		const reNumber = /[0-9]/;
		const isValid = (
			password != null && 
			password.length >= config.login.PASSWORD_MIN_LENGTH && 
			password.length <= config.login.PASSWORD_MAX_LENGTH && 
			reLowerCase.test(password) && 
			reNumber.test(password)
		);
		const retypePassValid = (password === this.state.retypePass);
		this.setState({
			password: password,
			passwordValid: isValid,
			retypePassValid: retypePassValid,
		});
	}

	onRetypePassChanged(e) {
		const retypePass = e.target.value;
		const isValid = (retypePass === this.state.password);
		this.setState({
			retypePass: retypePass,
			retypePassValid: isValid,
		});
	}

	onUlaChanged(e) {
		this.setState({
			ula: e.target.checked,
		});
	}


	handleRegistration = async event => {
		/*use signUp function to register*/
		event.preventDefault();
		this.setState({ isLoading: true });
		try {
			const newUser = await Auth.signUp({
				username: this.state.username,
				password: this.state.password,
				attributes: {
					email: this.state.mail,
				},
			});
			this.setState({
				newUser
			});
		} catch (e) {
			if (e.code === 'UsernameExistsException') {
				let strings = new LocalizedStrings({
					en: { msg: 'Error: username already exists', },
					fi: { msg: 'Virhe: käyttäjätunnus on jo käytössä', },
				});
				strings.setLanguage(this.props.match.params.language);
				alert(strings.msg);
			}
			else {
				alert(e.message);
			}
		}
		this.setState({ isLoading: false });
	}

	renderConfirmationForm() {
		let strings = new LocalizedStrings({
      en:{
        successHeader: 'Registration successfull!',
				successText: ' A confirmation email has been sent to ' + this.state.mail + 
				'. You must click the confirmation link in the email, before you can sign in.',
				loginBtnText: 'Login',
      },
      fi: {
        successHeader: 'Rekisteröinti onnistui!',
				successText: 'Sähköpostiisi ' + this.state.mail + 
					' on lähetetty vahvistusviesti, jonka vahvistuslinkkiä sinun tulee' + 
					' klikata ennen kuin voit kirjautua sisään.',
				loginBtnText: 'Kirjaudu',
      }
    });
    strings.setLanguage(this.props.match.params.language);

		return(
			<div>
				<h2>{strings.successHeader}</h2>
				<p>{strings.successText}</p>
				<Button className="main-btn">{strings.loginBtnText}</Button>
			</div>
		);
	}

	renderForm() {

    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        username:"Username:",
        register:"Register",
        password:"Password:",
        passwordAgain:"Password again:",
        email:"Email:",
        emailAgain:"Email again:",
				acceptUla:"I Accept the User Agreement",
				alreadyRegistered:"Already registered? ",
				loginHere:"Login here!",
      },
      fi: {
        username:"Käyttäjätunnus:",
        register:"Rekisteröidy",
        password:"Salasana:",
        passwordAgain:"Salasana uudelleen:",
        email:"Sähköposti:",
        emailAgain:"Sähköposti uudelleen:",
        acceptUla:"Hyväksyn käyttäjäehdot",
				alreadyRegistered:"Oletko jo rekisteröitynyt? ",
				loginHere:"Kirjaudu sisään tästä!",
      }
    });
    strings.setLanguage(this.props.match.params.language);



		/*The first form where the user enters info needed for an account*/
		return (
			<div id="register">
				<h2>{strings.register}</h2>
				<Form onSubmit={this.handleRegistration}>
					<FormGroup>
						<Label>{strings.username}</Label>
						<Input type="text" name="username" className={!this.state.usernameValid ? 'invalid' : ''} value={this.state.username} onChange={this.onUsernameChanged} required/>
					</FormGroup>
					<FormGroup>
						<Label>{strings.password}</Label>
						<Input type="password" name="password" className={!this.state.passwordValid ? 'invalid' : ''} value={this.state.password} onChange={this.onPasswordChanged}/>
					</FormGroup>
					<FormGroup>
						<Label>{strings.passwordAgain}</Label>
						<Input type="password" name="retypePass" className={!this.state.retypePassValid ? 'invalid' : ''} value={this.state.retypePass} onChange={this.onRetypePassChanged}/>
					</FormGroup>
					<FormGroup>
						<Label>{strings.email}</Label>
						<Input type="email" name="mail" className={!this.state.mailValid ? 'invalid' : ''} value={this.state.mail} onChange={this.onMailChanged}/>
					</FormGroup>
					<FormGroup>
						<Label>{strings.emailAgain}</Label>
						<Input type="email" name="retypeMail" className={!this.state.retypeMailValid ? 'invalid' : ''} value={this.state.retypeMail} onChange={this.onRetypeMailChanged}/>
					</FormGroup>
					<FormGroup check>
						<Label check>{' '}
							<Input type="checkbox" name="ula" value={this.state.ula} onChange={this.onUlaChanged}/>
							{strings.acceptUla}
						</Label>
					</FormGroup>
					<br/>
					<Input type="submit" value={strings.register} disabled={!this.validateForm()} className="btn main-btn mb-2" />
				</Form>
				<div>
					{strings.alreadyRegistered}
					<Link tag={Link} to={'/' + this.props.match.params.language + '/login/'}>
          	{strings.loginHere}
        	</Link>
				</div>
				{/*<Social_Login/>*/}
			</div>
		);
	}

	render() {
		/*decide which form to show, based on whether there is a 'newUser'*/
		return (
			this.state.newUser === null
			? this.renderForm()
			: this.renderConfirmationForm()
		);
	}
}
