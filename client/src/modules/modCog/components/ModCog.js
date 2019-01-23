/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

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


    };
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onCurPasswordChanged = this.onCurPasswordChanged.bind(this);
    this.onRePasswordChanged = this.onRePasswordChanged.bind(this);
    this.getAuthCode = this.getAuthCode.bind(this);


  }

  getAuthCode(e) {

    alert('out3')
 

   Auth.currentAuthenticatedUser()
   .then(user =>Auth.changePassword(user,this.state.typePass,this.state.retypePass) )
    .catch(err => alert('2' + JSON.stringify(err)));

   ;


  }
  onCurPasswordChanged(e) {
    const curPassword = e.target.value;
    this.setState({ typePass: curPassword })
  }

  onRePasswordChanged(e) {
    const reTypedPassword = e.target.value;
    this.setState({ retypePass: reTypedPassword })


  }

  onPasswordChanged(e) {
    const password = e.target.value;
    const reLowerCase = /[a-z]/;
    const reNumber = /[0-9]/;

    const isValidP = validationUtil.validatePassword(password);
    const isValidRetyped = validationUtil.validatePassword(password);

    this.setState({ isValid: isValidP })
    this.setState({ newPass: password })


  }

  //Actios to be caried upon mounting
  componentDidMount() {

  }


  render() {
    const { VInput, } = commonComponents;
    return (
      <div>


        <form>
          <em>Nykyinen salasana </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="curpassword" errormsg={'error'} onChange={this.onCurPasswordChanged} />
          </FormGroup>

          <em>New Password </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="password" onChange={this.onPasswordChanged} errormsg={'error'} isValid={this.state.passwordValid} value={this.state.password} onChange={this.onPasswordChanged} />
          </FormGroup>

          <em>Retype new password </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="retypedpassword" onChange={this.onRePasswordChanged} errormsg={'error'} isValid={this.state.passwordValid} value={this.state.retypedpassword} />
          </FormGroup>
          <button className="searchBtn main-btn btn" onClick={() => { this.getAuthCode() }}>
            ChangePassword </button><br />

        </form> </div>);


  }

}
export default ModCog 
