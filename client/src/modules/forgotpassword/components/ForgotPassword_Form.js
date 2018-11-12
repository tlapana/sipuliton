/*
This file implements forgot password form functionality. In this file is
implemented forgot password code sending to user's email and after that show
password changing objects to the user. In password changing user can change
password to account with sended code.
*/

import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";

/* Configuration files */
import config from "../../../config.js"

/* Localization */
import LocalizedStrings from 'react-localization';

/*
 ForgotPassword_Form class which implements all needed things for the password
 changing.
*/
export default class ForgotPassword_Form extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      newPassword:"",
      newPasswordAgain:"",
      code:"",
      codeSentSuccesfully: false,
      passwordChangedSuccesfully:false,
      passwordsMatch: true,
      codeSendingFailed: false,
      email:"",
      limitExceeded:false,
      codeIsValid:true,
      usernameIsValid:true,
      newPasswordIsValid:true,

    };
    this.sendCodeAgain = this.sendCodeAgain.bind(this);
    this.validateChangeForm = this.validateChangeForm.bind(this);
  }

  /*
  Returns all states back to normal after user decides to send code again. This
  method is called when user clicks send code again button.
  */
  sendCodeAgain(){
    this.setState({
      email:"",
      newPassword:"",
      newPasswordAgain:"",
      code:"",
      codeSentSuccesfully: false,
      passwordChangedSuccesfully:false,
      passwordsMatch: true,
      passwordChangingFailed: false,
      limitExceeded:false,
      codeIsValid:true,
      usernameIsValid:true,
      newPasswordIsValid:true,
    })
  }

  /*
  This method implements password changing code to the user's email.
  This method is called when user clicks send code button.
  */
  sendCode = (event) => {
      event.preventDefault();
      if(this.state.usernameIsValid){
        /* Implements forgot password code sending. */
        Auth.forgotPassword(this.state.username)
          .then(data => {
            console.log(data);
            this.setState({
              codeSentSuccesfully: true,
              email: data.CodeDeliveryDetails.Destination,
              codeSendingFailed: false,
              limitExceeded: false,
            });
          })
          .catch(err => {
            /* Exception when code is sent too many times in a short time period.*/
            if(err.code === "LimitExceededException"){
              this.setState({
                limitExceeded:true,
                codeSendingFailed:false
              });
            }
            else{
              this.setState({
                limitExceeded:false,
                codeSendingFailed:true
              });
            }
          });
      }
      else{
        this.setState({
          codeSendingFailed:true
        });
      }

  }

  /*
  Method which implements password changing for the user. This method is
  ran when user clicks change password button.
  */
  changePassword = (event) => {
    event.preventDefault();
    let strings = new LocalizedStrings({
      en:{
        changeSuccess:"Password changed successfully!",
      },
      fi: {
        changeSuccess:"Salasana vaihdettu onnistuneesti!",
      }
    });
    strings.setLanguage(this.props.language);

    if(this.state.passwordsMatch && this.state.codeIsValid
      && this.state.newPasswordIsValid) {
      /* Changes user password for the user. */
      Auth.forgotPasswordSubmit(
        this.state.username,
        this.state.code,
        this.state.newPassword
      )
        .then(data => {
          this.setState({passwordChangedSuccesfully: true});
          alert(strings.changeSuccess);
        })
        .catch(err => this.setState({
          passwordChangedSuccesfully:false,
          passwordChangingFailed: true
        }));
    }
    else{
      this.setState({
        passwordChangedSuccesfully:false,
        passwordChangingFailed: true
      });
    }

  }

	validateChangeForm() {
		/*Make sure all fields are okay*/
		const isValid = (
			this.state.newPasswordIsValid && this.state.newPassword.length > 0 &&
			this.state.passwordsMatch && this.state.newPasswordAgain.length > 0 && 
			this.state.codeIsValid && this.state.code.length > 0
		);
		return isValid;
	}

  /*
  This method implements code validation. This only checks that code is not
  too short or too long. Lenghts are read from config.js file.
  */
  changeCode = (event) => {
    const code = event.target.value;
    if (code.length >= config.login.CODE_MIN_LENGTH
      && code.length <= config.login.CODE_MAX_LENGTH) {
      this.setState({code: code, codeIsValid: true });
    }
    else {
        this.setState({code: code, codeIsValid: false });
    }
  }

  /*
  This method implements username validation. This only checks that username is
  not too short or too long. Lenghts are read from config.js file.
  */
  changeUsername = (event) => {
    const username = event.target.value;
    if (username.length >= config.login.USERNAME_MIN_LENGTH
      && username.length <= config.login.USERNAME_MAX_LENGTH) {
      this.setState({username: username, usernameIsValid: true });
    }
    else {
        this.setState({username: username, usernameIsValid: false });
    }
  }

  /*
  This method implements new password validation. This only checks that password
  is not too short or too long. Lenghts are read from config.js file.
  */
  changeNewPassword = (event) => {
    const password = event.target.value;
    const reLowerCase = /[a-z]/;
    const reNumber = /[0-9]/;
		const isValid = (
			password != null && 
			password.length >= config.login.PASSWORD_MIN_LENGTH && 
			password.length <= config.login.PASSWORD_MAX_LENGTH && 
			reLowerCase.test(password) && 
			reNumber.test(password)
		);

    const passwordsMatch = (password === this.state.newPasswordAgain);
    this.setState({ 
      newPassword: password, 
      newPasswordIsValid: isValid, 
      passwordsMatch: passwordsMatch,
    });
  }

  /*
  This method implements second new password validation. This only checks that
  password is the same as the first password. 
  */
  changeNewPasswordAgain = (event) => {
    const password2 = event.target.value;
    this.setState({
      newPasswordAgain: password2,
      passwordsMatch: (password2 === this.state.newPassword),
    });
  }

  render(){
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        username:"Username:",
        sendCode:"Send code",
        usernotfound:"User not found or username is invalid.",
        limitexceeded:"You send a code too many times in a row, try again later.",
        passwordchangedidntsuccee:"Password didn't succeed, password or code is invalid.",
        codesentto:"Code was sent to following email address: ",
        newpassword:"New password:",
        newpasswordagain:"New password again:",
        code:"Code:",
        didntGetEmail:"Didn't get email? ",
        sendcodeagain:"Send code again",
        changePassword:"Change password",
      },
      fi: {
        username:"Käyttäjänimi:",
        sendCode:"Lähetä koodi",
        usernotfound:"Käyttäjää ei löydy tai käyttäjänimi ei ole validi.",
        limitexceeded:"Lähetit koodin liian monta kertaa, yritä myöhemmin uudelleen.",
        passwordchangedidntsuccee:"Salasanan vaihto ei onnistunut, salasana tai koodi ei ole validi.",
        codesentto:"Koodi lähetetty sähköpostilla osoitteeseen: ",
        newpassword:"Uusi salasana:",
        newpasswordagain:"Uusi salasana uudelleen:",
        code:"Koodi:",
        didntGetEmail:"Etkö saanut sähköpostia? ",
        sendcodeagain:"Lähetä koodi uudelleen",
        changePassword:"Vaihda salasana",
      }
    });
    strings.setLanguage(this.props.language);

    return (
      <div>
        {this.state.codeSendingFailed && <div>{strings.usernotfound}</div>}
        {this.state.limitExceeded && <div>{strings.limitexceeded}</div>}
        {!this.state.codeSentSuccesfully &&
          <Form onSubmit={this.sendCode}>
            <FormGroup>
              <Label>{strings.username}</Label>
              <Input className={!this.state.usernameIsValid ? 'invalid' : ''} value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
            </FormGroup>
            <Input className="main-btn big-btn max-w-10" type="submit" value={strings.sendCode} />
          </Form>
        }
        {this.state.passwordChangingFailed &&
          <div>
            {strings.passwordchangedidntsuccee}
          </div>
        }

        {this.state.codeSentSuccesfully && 
          <div>
            <p>{strings.codesentto}{this.state.email}.</p>
            <p>
              {strings.didntGetEmail}
              <Button onClick={this.sendCodeAgain} className="secondary-btn small-btn">{strings.sendcodeagain}</Button>
            </p>
            <Form onSubmit={this.changePassword}>
              <FormGroup>
                <Label>{strings.newpassword}</Label>
                <Input className={!this.state.newPasswordIsValid ? 'invalid' : ''} value={this.state.newPassword} onChange={this.changeNewPassword} type="password" name="password" required autoFocus />
              </FormGroup>
              <FormGroup>
                <Label>{strings.newpasswordagain}</Label>
                <Input className={!this.state.passwordsMatch ? 'invalid' : ''} value={this.state.newPasswordAgain} onChange={this.changeNewPasswordAgain} type="password" name="password2" required />
              </FormGroup>
              <FormGroup>
                <Label>{strings.code}</Label>
                <Input className={!this.state.codeIsValid ? 'invalid' : ''} value={this.state.code} onChange={this.changeCode} type="text" name="password" required />
              </FormGroup>
              <Input type="submit" value={strings.changePassword} disabled={!this.validateChangeForm()} className="main-btn big-btn max-w-10"/>
            </Form>
          </div>
        }

        {this.state.passwordChangedSuccesfully && <Redirect to={'/' + this.props.language + '/login'} />}

      </div>

    )
  }
}
