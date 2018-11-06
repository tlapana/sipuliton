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
		this.restaurant.pictures = ["", "", ""];
		this.restaurant.priceLevel = 2;
		this.restaurant.userScore = 3;
		this.restaurant.allergyTags = ["Sipuliton", "Munaton"];
		this.restaurant.openingHours = {monFri: 08002100, sat: 09002100, sun: 09001800};
		this.restaurant.description = "Qwertyuiop. Asdfghjkl.<br>Zxcvbnm.";
		
	}
	
	render() {
		<div id="restaurant">
		<h2>{this.restaurant.name()}</h2><br>
		<div id="restaurantPictures"><img src={this.restaurant.pictures[0]()} alt="Restaurant picture"></div>
		<div id="restaurantStats">Hintataso: {this.restaurant.priceLevel()}<br>
		Käyttäjien arvio: {this.restaurant.userScore()}<br>
		Allergiatunnisteet:<br>
		{this.restaurant.allergyTags()}</div><br>
		<div id="restaurantDesc">{this.restaurant.description()}</div><br>
		<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2">Lisää arvostelu></Input>
		</div>
	}
}