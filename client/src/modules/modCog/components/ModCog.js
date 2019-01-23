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
      isSame: false



    };
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onCurPasswordChanged = this.onCurPasswordChanged.bind(this);
    this.onRePasswordChanged = this.onRePasswordChanged.bind(this);
    this.getAuthCode = this.getAuthCode.bind(this);


  }

  getAuthCode(e) {

 


    if(this.state.isSame && this.state.isValid)  {
    
        //Auth.changePassword(user, this.state.typePass, this.state.retypePass)
         Auth.currentAuthenticatedUser()
      .then(user =>Auth.changePassword(user, this.state.curPass, this.state.retypePass))
      .catch(err => alert(err.message));

    ;
  }


  }
  onCurPasswordChanged(e) {
    const curPassword = e.target.value;
    this.setState({ curPass: curPassword })
  }

  onRePasswordChanged(e) {
    const reTypedPassword = e.target.value;
    // this.setState({ retypePass: reTypedPassword })
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
      en:{
        username:"Username:",
        sendCode:"Send code",
        sending:"Sending...",
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
        loading:"Loading...",
        passwordError:"Password must be at least 8 characters long and " + 
					"contain numbers lower case characters and numbers",
				passwordAgainError:"Passwords must match",
        codeError:"Code must be 2-9 characters long",
      },
      fi: {
        username:"Käyttäjänimi:",
        sendCode:"Lähetä koodi",
        sending:"Lähetetään...",
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
        loading:"Ladataan...",
        passwordError:"Salasanan tulee olla ainakin 8 merkkiä pitkä ja " + 
          "siinä tulee olla pieniä kirjaimia ja numeroita",
        passwordAgainError:"Salasanojen tulee olla samat",
        codeError:"Koodin tulee olla 2-9 merkkiä pitkä",
      }
});
strings.setLanguage('fi');
    return (
      
      <div>

    <ErrorBlock hidden={!this.state.codeSendingFailed} errormsg={strings.usernotfound} />
        <ErrorBlock hidden={!this.state.limitExceeded} errormsg={strings.limitexceeded} />
        <form>
          <em>Nykyinen salasana </em>
          <FormGroup>
            {this.state.error}
            <VInput type="password" name="curpassword" errormsg={'error'} onChange={this.onCurPasswordChanged} />
          </FormGroup>

          <em>New Password </em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isSame && this.state.isValid} type="password" name="password" onChange={this.onPasswordChanged} errormsg={'error'} value={this.state.password} onChange={this.onPasswordChanged} required />
          </FormGroup>

          <em>Retype new password </em>
          <FormGroup>
            {this.state.error}
            <VInput isValid={this.state.isSame} type="password" name="retypedpassword" onChange={this.onRePasswordChanged} errormsg={'error'} value={this.state.retypedpassword} />
          </FormGroup>
          <input type="button" className="searchBtn main-btn btn" value="test" onClick={this.getAuthCode}/>


        </form> </div>);


  }

}
export default ModCog 
