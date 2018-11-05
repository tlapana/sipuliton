/* In this file is implemented recular main menu list item functionality. */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
} from 'reactstrap';



export default class MainMenu_ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {hovered: false};
    this.hover = this.hover.bind(this);
  }

  /*
  Called when user's mouse enters or leaves the area. This method changes
  hovered state, which is used in styling.
  */
  hover() {
      this.setState({ hovered: !this.state.hovered});
  }

  render(){

    /* Styles for the log out button. */
    var itemStyle = {
      display: 'block',
      color: '#000',
      'borderStyle': 'solid solid solid solid',
      'borderColor': 'white',
      'width':'75%',
      'textAlign':'center',
      'margin':'20px 30px',
      'z':'-1'
    };
    var itemBlockStyle= {
      'textAlign':'center'
    };

    /* Style for the hovered state. */
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
        <NavLink style={itemStyle} onMouseLeave={this.hover} onMouseEnter={this.hover} tag={Link} to={this.props.path}>
          {this.props.text}
        </NavLink>
      </NavItem>
    )
  }
}
