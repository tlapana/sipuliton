import React from 'react';
import {
  form,
} from 'reactstrap';

import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";


export default class MainMenu_ListItem extends React.Component{
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
      limitExceeded:false
    };
    this.sendCodeAgain = this.sendCodeAgain.bind(this);
  }

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
      limitExceeded:false
    })
  }

  sendCode = (event) => {
      event.preventDefault();
      /* Implement configuration of Authorization to cogniton*/
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

  changePassword = (event) => {
    event.preventDefault();
    if(this.state.passwordsMatch){
      Auth.forgotPasswordSubmit(this.state.username, this.state.code, this.state.newPassword)
        .then(data => {
          this.setState({passwordChangedSuccesfully: true});
          alert("Salasana vaihdettu onnistuneesti!");
        })
        .catch(err => console.log(err));
    }

  }

  changeCode = (event) => {
      this.setState({ code: event.target.value });
  }

  changeUsername = (event) => {
      /*Implement validation of username*/
      this.setState({ username: event.target.value });
  }

  changeNewPassword = (event) => {
    /*Implement validation of password*/
    this.setState({ newPassword: event.target.value });
  }

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

  }

  render(){
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

    return (
      <div>
        {this.state.codeSendingFailed && <div>Käyttäjää ei löydy</div>}
        {this.state.limitExceeded && <div>Lähetit koodin liian monta kertaa, yritä myöhemmin uudelleen</div>}
        {!this.state.codeSentSuccesfully &&
          <form onSubmit={this.sendCode}>
            Käyttäjänimi: <input className="input" value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
            <input type="submit" value="Lähetä koodi" />
          </form>
        }

        {this.state.codeSentSuccesfully &&
          <div>
            <p>Koodi lähetetty sähköpostilla osoitteeseen: {this.state.email}</p>
            <form onSubmit={this.changePassword}>
              Uusi salasana: <input className="input" value={this.state.newPassword} onChange={this.changeNewPassword} type="password" name="password" required />
              Uusi salasana uudelleen: <input className="input" style={passwordBorder} value={this.state.newPasswordAgain} onChange={this.changeNewPasswordAgain} type="password" name="password" required />
              Koodi: <input className="input" value={this.state.code} onChange={this.changeCode} type="password" name="password" required />
              <input type="submit" value="Vaihda salasana"/>
            </form>
            <button onClick={this.sendCodeAgain}>Lähetä koodi uudelleen</button>
          </div>
        }

        {this.state.passwordChangedSuccesfully && <Redirect to="/login" />}

      </div>

    )
  }
}
