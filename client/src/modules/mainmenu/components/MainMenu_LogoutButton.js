import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  Button
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { Redirect } from "react-router-dom";

export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {hovered: false, logoutSuccesfully: true};
    this.hover = this.hover.bind(this);
    this.logout = this.logout.bind(this);
  }

  hover() {
      /* Changes button background color when user inserts mouse over button. */
      this.setState({ hovered: !this.state.hovered});
  }

  logout(){
    /* Logs user out */
    Auth.signOut()
        .then(data => this.setState({logoutSuccesfully: true}))
        .catch(err => console.log(err));
  }

  render(){

    var itemStyle = {
      display: 'block',
      color: '#000',
      'backgroundColor': '#99ff99',
      'borderStyle': 'solid solid solid solid',
      'borderColor': 'white',
      'borderWidth': '3px',
      'width':'75%',
      'textAlign':'center',
      'margin':'20px 30px',
      'z':'-1'
    };
    var itemBlockStyle= {
      'textAlign':'center'
    };

    if(this.state.hovered){
      itemStyle = {
        display: 'block',
        color: 'grey',
        'borderStyle': 'solid solid solid solid',
        'borderColor': 'white',
        'width':'75%',
        'textAlign':'center',
        'margin':'20px 30px',
        'z':'-1',
        'backgroundColor': 'white'
      };
    }


    return (
      <div>
        <NavItem style={itemBlockStyle} >
          <Button style={itemStyle} onMouseLeave={this.hover} onMouseEnter={this.hover} onClick={this.logout}>
            Kirjaudu ulos
          </Button>
        </NavItem>
        {this.state.logoutSuccesfully && <Redirect to="/profile" />}
      </div>
    )
  }
}
