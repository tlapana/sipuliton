/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import ReactStars from 'react-stars'
import { Button } from 'reactstrap';
import Select from 'react-select';
import { Auth } from 'aws-amplify';
import { stringify } from 'querystring';


 class ModCog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      text:'222'
    }

// Collect confirmation code and new password, then
/* Auth.forgotPasswordSubmit('Antha1', "962110", '12345678')
    .then(data => alert(data))
    .catch(err => alert('2' + JSON.stringify(err)));
  
  } */
}
getAuthCode()  {

   alert('ok1')
   Auth.currentAuthenticatedUser()
   .then(user => {


    alert(completeNewPassword(user , 'aaa',null));
   })
   

   

}
  //Actios to be caried upon mounting
  componentDidMount() {

  }
 
  
  render() {
    
    return(
      <div>
     <button onClick={()=>{this.getAuthCode()}}>
      Lähetä aktivointilinkki</button><br/>

    <form><em>New Password </em>
    <input type="text"/><br/>
    <em>Confirm password</em><input type="text"/><br/>
    <input type="Submit" value="Vaihda salasanaa"/>
    
    </form>) </div>);
    
    
  }
  
}
export default  ModCog 
