/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components
I used forgot password-module as reference, when I did this.
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
      isValid: false,
      retypePass: '',
      retypePassValid: false,
      curPass: '',
      newPass: '',
      curPassValid: false,
      isSame: false,
      message: ''



    };

    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onCurPasswordChanged = this.onCurPasswordChanged.bind(this);
    this.onRePasswordChanged = this.onRePasswordChanged.bind(this);
    this.getAuthCode = this.getAuthCode.bind(this);


  }

  getAuthCode(e) {

    let strings = new LocalizedStrings({
      en: {

        passwordError: "Current password doesn't match",
        limit: "You send a password too many times in a row, try again later",

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
            if (err.code + '' === "LimitExceededException")
             { this.setState({ message: strings.limit })
             }
             else  {
              this.setState({ message: strings.passwordError })
             }
          } catch (e) {
            alert(e)
          }
        });

      ;
    }


  }
  onCurPasswordChanged(e) {
    const curPassword = e.target.value;
    this.setState({ curPass: curPassword })
  }

  onRePasswordChanged(e) {
    const reTypedPassword = e.target.value;
  
    this.state.retypePass = reTypedPassword;
    this.setState({ isSame: reTypedPassword == this.state.newPass })
  }

  onPasswordChanged(e) {



    const password = e.target.value;
    const reLowerCase = /[a-z]/;
    const reNumber = /[0-9]/;

    const isValidP = validationUtil.validatePassword(password);
    const isValidRetyped = validationUtil.validatePassword(password);

    this.setState({ isValid: isValidP })
    this.setState({ isSame: this.state.password == this.state.retypePass })
    this.setState({ newPass: password })


  }

  //Actios to be caried upon mounting
  componentDidMount() {

  }


  render() {
    const { VInput, ErrorBlock } = commonComponents;
    let strings = new LocalizedStrings({
      en: {
        title: "Change password",
        usernotfound: "User not found or username is invalid.",
        limitexceeded: "You send a code too many times in a row, try again later.",
        curpassword: "cur password:",
        newpassword: "New password:",
        newpasswordagain: "New password again:",
        sendcodeagain: "Send code again",
        changePassword: "Change password",
        passwordError: "cur password doesn't match",
        passwordAgainError: "Passwords must match",

        change: "Change"
      },
      fi: {
        change: "Vaihda",
        title: "Vaihda salasana",
        curpassword: "Nykyinen salasana",
        limitexceeded: "Lähetit koodin liian monta kertaa, yritä myöhemmin uudelleen.",
        newpassword: "Uusi salasana:",
        newpasswordagain: "Uusi salasana uudelleen:",
        changePassword: "Vaihda salasana",
        passwordError: "Nykyinen salasana ei täsmää",
        passwordAgainError: "Salasanojen tulee olla samat",

      }
    });
    strings.setLanguage(this.props.match.params.language);
    return (

      <div>
        <h3>{strings.title}</h3>
        <ErrorBlock hidden={false} errormsg={this.state.message} />

        <form>
          <em>{strings.curpassword} </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="curpassword" errormsg={'error'} onChange={this.onCurPasswordChanged} />
          </FormGroup>

          <em>{strings.newpassword} </em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isSame && this.state.isValid} type="password" name="password" onChange={this.onPasswordChanged} errormsg={'error'} value={this.state.password} onChange={this.onPasswordChanged} required />
          </FormGroup>

          <em>{strings.newpasswordagain}</em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isSame} type="password" name="retypedpassword" onChange={this.onRePasswordChanged} errormsg={'error'} value={this.state.retypedpassword} />
          </FormGroup>
          <input type="button" className="searchBtn main-btn btn" value={strings.change} onClick={this.getAuthCode} />


        </form> </div>);


  }

}
export default ModCog 
