/*
This file implements forgot password form functionality. In this file is
implemented forgot password code sending to user's email and after that show
password changing objects to the user. In password changing user can change
password to account with sended code.
*/

import React from 'react';
import {
  form,
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
      passwordsMatch: false,
      codeSendingFailed: false,
      email:"",
      limitExceeded:false,
      codeIsValid:true,
      usernameIsValid:true,
      newPasswordIsValid:true,
      newPasswordAgainIsValid:true

    };
    this.sendCodeAgain = this.sendCodeAgain.bind(this);
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
      passwordsMatch: false,
      passwordChangingFailed: false,
      limitExceeded:false,
      codeIsValid:true,
      usernameIsValid:true,
      newPasswordIsValid:true,
      newPasswordAgainIsValid:true
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
              email:data.CodeDeliveryDetails.Destination,
              codeSendingFailed:false
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
    if(this.state.passwordsMatch && this.state.codeIsValid
      && this.state.newPasswordIsValid && this.state.newPasswordAgainIsValid){
      /* Changes user password for the user. */
      Auth.forgotPasswordSubmit(
        this.state.username,
        this.state.code,
        this.state.newPassword
      )
        .then(data => {
          this.setState({passwordChangedSuccesfully: true});
          alert("Salasana vaihdettu onnistuneesti!");
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

  /*
  This method implements code validation. This only checks that code is not
  too short or too long. Lenghts are read from config.js file.
  */
  changeCode = (event) => {
    if(event.target.value.length >= config.login.CODE_MIN_LENGTH
      && event.target.value.length <= config.login.CODE_MAX_LENGTH){
      this.setState({code: event.target.value, codeIsValid: true });
    }
    else{
        this.setState({code: event.target.value, codeIsValid: false });
    }
  }

  /*
  This method implements username validation. This only checks that username is
  not too short or too long. Lenghts are read from config.js file.
  */
  changeUsername = (event) => {
    if(event.target.value.length >= config.login.USERNAME_MIN_LENGTH
      && event.target.value.length <= config.login.USERNAME_MAX_LENGTH){
      this.setState({username: event.target.value, usernameIsValid: true });
    }
    else{
        this.setState({username: event.target.value, usernameIsValid: false });
    }
  }

  /*
  This method implements new password validation. This only checks that password
  is not too short or too long. Lenghts are read from config.js file.
  */
  changeNewPassword = (event) => {
    if(event.target.value.length >= config.login.PASSWORD_MIN_LENGTH
      && event.target.value.length <= config.login.PASSWORD_MAX_LENGTH){
        this.setState({ newPassword: event.target.value, newPasswordIsValid: true });
    }
    else{
        this.setState({newPassword: event.target.value, newPasswordIsValid: false });
    }
  }

  /*
  This method implements second new password validation. This only checks that
  password is not too short or too long. Lenghts are read from config.js file.
  */
  changeNewPasswordAgain = (event) => {
    /*Implement validation of password*/
    if(event.target.value === this.state.newPassword){
      this.setState({
        newPasswordAgain: event.target.value,
        passwordsMatch:true
      });
    }
    else{
      this.setState({
        newPasswordAgain: event.target.value,
        passwordsMatch:false
      });
    }
    if(event.target.value.length >= config.login.PASSWORD_MIN_LENGTH
      && event.target.value.length <= config.login.PASSWORD_MAX_LENGTH){
        this.setState({newPasswordAgainIsValid: true });
    }
    else{
        this.setState({newPasswordAgainIsValid: false });
    }

  }

  render(){

    /* Password fields border colors. Borders are red until passwords matches.*/
    var passwordBorder = {
      'borderStyle': 'solid solid solid solid',
      'borderColor': 'black'
    };
    if(!this.state.passwordsMatch){
      passwordBorder = {
        'borderStyle': 'solid solid solid solid',
        'borderColor': 'red'
      };
    }

    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        username:"Username:",
        usernotfound:"User not found or username is invalid.",
        limitexceeded:"You send code too many times in a row, try again later.",
        passwordchangedidntsuccee:"Password didn't succee, password or code is invalid.",
        codesentto:"Code is sent to following email address: ",
        newpassword:"New password: ",
        newpasswordagain:"New password again: ",
        code:"Code: ",
        sendcodeagain:"Send code again"
      },
      fi: {
        username:"Käyttäjänimi:",
        usernotfound:"Käyttäjää ei löydy tai käyttäjänimi ei ole validi.",
        limitexceeded:"Lähetit koodin liian monta kertaa, yritä myöhemmin uudelleen.",
        passwordchangedidntsuccee:"Salasanan vaihto ei onnistunut, salasana tai koodi ei ole validi.",
        codesentto:"Koodi lähetetty sähköpostilla osoitteeseen: ",
        newpassword:"Uusi salasana: ",
        newpasswordagain:"Uusi salasana uudelleen: ",
        code:"Koodi: ",
        sendcodeagain:"Lähetä koodi uudelleen"
      }
    });
    strings.setLanguage(this.props.language);

    return (
      <div>
        {this.state.codeSendingFailed && <div>{strings.usernotfound}</div>}
        {this.state.limitExceeded && <div>{strings.limitexceeded}</div>}
        {!this.state.codeSentSuccesfully &&
          <form onSubmit={this.sendCode}>
            {strings.username}<input className="input" value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
            <input type="submit" value="Lähetä koodi" />
          </form>
        }
        {this.state.passwordChangingFailed &&
          <div>
            {strings.passwordchangedidntsuccee}
          </div>
        }
        {this.state.codeSentSuccesfully &&

          <div>
            <p>{strings.codesentto}{this.state.email}</p>
            <form onSubmit={this.changePassword}>
              {strings.newpassword} <input className="input" value={this.state.newPassword} onChange={this.changeNewPassword} type="password" name="password" required />
              {strings.newpasswordagain} <input className="input" style={passwordBorder} value={this.state.newPasswordAgain} onChange={this.changeNewPasswordAgain} type="password" name="password" required />
              {strings.code} <input className="input" value={this.state.code} onChange={this.changeCode} type="text" name="password" required />
              <input type="submit" value="Vaihda salasana"/>
            </form>
            <button onClick={this.sendCodeAgain}>{strings.sendcodeagain}</button>
          </div>
        }

        {this.state.passwordChangedSuccesfully && <Redirect to="/login" />}

      </div>

    )
  }
}
