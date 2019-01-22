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
      isValid:false,
      retypePass:'',
      isValid:''

};
this.onPasswordChanged = this.onPasswordChanged.bind(this);

    
}

getAuthCode(e)  {

   alert('Password legal='+ this.state.isValid)

   
   Auth.currentAuthenticatedUser()
   .then(user =>Auth.changePassword(user,'testuser1','Testuser13') )
    .catch(err => alert('2' + JSON.stringify(err)));
   ;
   

   

}

onPasswordChanged(e) {
  const password = e.target.value;
  const reLowerCase = /[a-z]/;
  const reNumber = /[0-9]/;
  
  const isValidP = validationUtil.validatePassword(password);

  this.setState({isValid: isValidP})



}

  //Actios to be caried upon mounting
  componentDidMount() {

  }
 
  
  render() {
    const { VInput, } = commonComponents;
    return(
      <div>


    <form>
      <em>Nykyinen salasana </em>
    <FormGroup>
    {this.state.error}
    <VInput type="password"   name="password" onChange={this.onPasswordChanged} errormsg={'error'} isValid={this.state.passwordValid} value={this.state.password} onChange={this.onPasswordChanged}/>
</FormGroup>

<em>New Password </em>
    <FormGroup>
    {this.state.error}
    <VInput type="password"   name="password" onChange={this.onPasswordChanged} errormsg={'error'} isValid={this.state.passwordValid} value={this.state.password} onChange={this.onPasswordChanged}/>
</FormGroup>

<em>Retype new password </em>
    <FormGroup>
    {this.state.error}
    <VInput type="password"   name="password" onChange={this.onPasswordChanged} errormsg={'error'} isValid={this.state.passwordValid} value={this.state.password} onChange={this.onPasswordChanged}/>
</FormGroup>
<button onClick={()=>{this.getAuthCode()}}>
       changePassword </button><br/>

   
    
    </form> </div>);
    
    
  }
  
}
export default  ModCog 
