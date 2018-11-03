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

  hover() {
      /* Changes button background color when user inserts mouse over button. */
      this.setState({ hovered: !this.state.hovered});
  }

  render(){

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
