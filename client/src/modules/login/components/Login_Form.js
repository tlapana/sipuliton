import React from 'react';
import {
  NavItem,
  NavLink,
  form,
  Button
} from 'reactstrap';

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";


export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:"",
      loggingFailed: false,
      loggingSucceeded:false,
    };
  }

  login = event =>{
      event.preventDefault();
      /* Implement configuration of Authorization to cogniton*/
      Auth.signIn(this.state.username,this.state.password)
        .then(user => {
          if(user.challengeName === "NEW_PASSWORD_REQUIRED"){
            user.completeNewPasswordChallenge(this.state.password).then(s => {
              console.log(s);
            }).catch(err => console.log(err));
          }
          else{
              console.log(user.username+" logged in!");
              this.setState({loggingSucceeded:true});
          }
      })
      .catch(e => {
        this.setState({loggingFailed:true});
      });
  }



  changeUsername = (event) => {
      /*Implement validation of username*/

      this.setState({ username: event.target.value });
  }

  changePassword = (event) => {
    /*Implement validation of password*/

    this.setState({ password: event.target.value });
  }


  render(){
    return (
      <div>
        {this.state.loggingFailed && <div> Väärä käyttäjätunnus tai salasana!</div>}
        <form onSubmit={this.login}>
          Käyttäjänimi: <input className="input" value={this.state.username} onChange={this.changeUsername} type="text" name="username" required />
          Salasana: <input className="input" value={this.state.password} onChange={this.changePassword} type="password" name="password" required />
          <input type="submit" value="Kirjaudu" />
        </form>
        {this.state.loggingSucceeded && <Redirect to="/profile" />}


      </div>

    )
  }
}
