import React from 'react';
import MainMenu from './styles.css'
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

export default class MainMenu_ListItem extends React.Component{

  render(){
    const itemStyle = {
      display: 'block',
      color: '#000',
      'borderStyle': 'none none solid none',
      'borderColor': 'white',
      'width':'75%',
      'textAlign':'center',
      'margin':'0px 30px'
    };
    const itemBlockStyle= {
      'text-align: center':'center'
    }
    return (
      <NavItem style={itemBlockStyle}>
        <NavLink style={itemStyle} tag={Link} to={this.props.path}>
          {this.props.text}
        </NavLink>
      </NavItem>
    )
  }
}
