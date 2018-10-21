import React from 'react';
import { Link } from 'react-router-dom';
import {
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
      'margin':'0px 30px',
      'z':'-1'
    };
    const itemBlockStyle= {
      'textAlign':'center'
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
