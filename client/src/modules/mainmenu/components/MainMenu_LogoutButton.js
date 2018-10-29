import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
  Button
} from 'reactstrap';
import { Auth } from 'aws-amplify';


export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {hovered: false};
    this.hover = this.hover.bind(this);
    this.logout = this.logout.bind(this);
  }

  hover() {
      /* Sets menu visibility to visible or no visible. */
      this.setState({ hovered: !this.state.hovered});
  }

  logout(){

    /* Implement user logout */
    Auth.signOut()
        .then(data => console.log(data))
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
      <NavItem style={itemBlockStyle} >
        <Button style={itemStyle} onMouseLeave={this.hover} onMouseEnter={this.hover} onClick={this.logout}>
          Kirjaudu ulos
        </Button>
      </NavItem>
    )
  }
}
