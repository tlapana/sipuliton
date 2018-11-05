import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.restaurant.name = "Test";
		this.restaurant.picture = "";
	}
	render() {
		<div id="restaurant">
		<h2>{this.restaurant.name()}</h2><br>
		<div id="restaurantPictures"><img src={this.restaurant.picture()} alt="Restaurant picture"></div>
		<div id="restaurantStats"></div><br>
		<div id="restaurantDesc"></div><br>
		<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2">Lisää arvostelu></Input>
		</div>
	}
}