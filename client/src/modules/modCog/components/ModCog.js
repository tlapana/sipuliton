/*
  UI for changing password via cognito
*/

import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
} from 'reactstrap';
import { Auth } from "aws-amplify";
import commonComponents from '../../common';

import * as validationUtil from "../../../validationUtil";
import LocalizedStrings from 'react-localization';


class ModCog extends React.Component {

  //lborrowed directly from Search

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isValid: true,
      retypePass: '',
      retypePassValid: true,
      curPass: '',
      newPass: '',
      curPassValid: true,
      isSame: true,
      message: '',
    };

    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onCurPasswordChanged = this.onCurPasswordChanged.bind(this);
    this.onRePasswordChanged = this.onRePasswordChanged.bind(this);
    this.getAuthCode = this.getAuthCode.bind(this);
    this.validateAll = this.validateAll.bind(this);
  }

  getAuthCode(e) {
    e.preventDefault();
    let strings = new LocalizedStrings({
      en: {
        passwordError: "Current password doesn't match",
        limit: "You sent a password too many times in a row, try again later",
      },
      fi: {
        passwordError: "Nykyinen salasana ei täsmää",
        limit: "Lähetit salasanan liian monta kertaa, yritä myöhemmin uudelleen.",
      }
    });

    strings.setLanguage(this.props.match.params.language);

    if (this.state.isSame && this.state.isValid) {
      this.setState({ message: strings.limit })

      //Auth.changePassword(user, this.state.typePass, this.state.retypePass)
      Auth.currentAuthenticatedUser()
        .then(user => Auth.changePassword(user, this.state.curPass, this.state.retypePass))
        .catch(err => {
          this.setState({ message: err.code + ':' });
          try {
            if (err.code + '' === "LimitExceededException") { 
              this.setState({ message: strings.limit })
             }
             else  {
              this.setState({ message: strings.passwordError })
             }
          } catch (e) {
            alert(e)
          }
        });
    }
  }

  onCurPasswordChanged(e) {
    const curPassword = e.target.value;
    this.setState({ curPass: curPassword, curPassValid: curPassword != '' });
  }

  onRePasswordChanged(e) {
    const reTypedPassword = e.target.value;
    this.setState({ isSame: reTypedPassword == this.state.newPass, retypePass: reTypedPassword });
  }

  onPasswordChanged(e) {
    const password = e.target.value;
    const isValidP = validationUtil.validatePassword(password);
    this.setState({ 
      isValid: isValidP, 
      isSame: password === this.state.retypePass, 
      newPass: password,
    });
  }

  validateAll() {
    return validationUtil.validatePassword(this.state.newPass) && 
      this.state.newPass === this.state.retypePass &&
      this.state.curPassword != '';
  }

  render() {
    const { VInput, ErrorBlock } = commonComponents;
    let strings = new LocalizedStrings({
      en: {
        title: "Change password",
        usernotfound: "User not found or username is invalid.",
        limitexceeded: "You send a code too many times in a row, try again later.",
        curpassword: "Current password:",
        newpassword: "New password:",
        newpasswordagain: "New password again:",
        sendcodeagain: "Send code again",
        changePassword: "Change password",
        passwordError: "Current password can't be empty",
        passwordAgainError: "Passwords must match",
        passwordValidError: "Password must be at least 8 characters long and " +
          "contain numbers lower case characters and numbers",
        change: "Change",
      },
      fi: {
        change: "Vaihda",
        title: "Vaihda salasana",
        curpassword: "Nykyinen salasana",
        limitexceeded: "Lähetit koodin liian monta kertaa, yritä myöhemmin uudelleen.",
        newpassword: "Uusi salasana:",
        newpasswordagain: "Uusi salasana uudelleen:",
        changePassword: "Vaihda salasana",
        passwordError: "Nykyinen salasana ei voi olla tyhjä",
        passwordAgainError: "Salasanojen tulee olla samat",
        passwordValidError: "Salasanan tulee olla ainakin 8 merkkiä pitkä ja " +
          "siinä tulee olla pieniä kirjaimia ja numeroita",
      }
    });
    strings.setLanguage(this.props.match.params.language);
    return (

      <div>
        <h3>{strings.title}</h3>
        <ErrorBlock hidden={false} errormsg={this.state.message} />

        <form onSubmit={this.getAuthCode}>
          <em>{strings.curpassword} </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="curpassword" isValid={this.state.curPassValid} errormsg={strings.passwordError} onChange={this.onCurPasswordChanged} value={this.state.curPass} />
          </FormGroup>

          <em>{strings.newpassword} </em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isValid} type="password" name="password" onChange={this.onPasswordChanged} errormsg={strings.passwordValidError} value={this.state.newPass} required />
          </FormGroup>

          <em>{strings.newpasswordagain}</em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isSame} type="password" name="retypedpassword" onChange={this.onRePasswordChanged} errormsg={strings.passwordAgainError} value={this.state.retypePass} />
          </FormGroup>

          <VInput type="submit" className="main-btn btn max-w-10" isValid={this.validateAll} value={strings.change} />


        </form>
      </div>);


  }

}
export default ModCog 
