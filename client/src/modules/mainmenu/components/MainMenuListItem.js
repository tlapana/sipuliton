/* In this file is implemented recular main menu list item functionality. */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavItem,
  NavLink,
} from 'reactstrap';



export default class MainMenuListItem extends React.Component{
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
    return (
      <NavItem className="menu-item" >
        <NavLink onMouseLeave={this.hover} onMouseEnter={this.hover} tag={Link} to={this.props.path}>
          {this.props.text}
        </NavLink>
      </NavItem>
    )
  }
}
