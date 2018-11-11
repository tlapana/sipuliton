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
import ReviewList from './Review_List.js'
const restaurantDataUrl = "";

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//How the restaurant properties is made up, for now
			this.restaurant.name : "Test";
			this.restaurant.pictures : ["", "", ""];
			this.restaurant.priceLevel : 2;
			this.restaurant.userScore : 3;
			this.restaurant.allergyTags : ["Sipuliton", "Munaton"];
			this.restaurant.openingHours : {monFri: 08002100, sat: 09002100, sun: 09001800};
			this.restaurant.description : "Qwertyuiop. Asdfghjkl.<br>Zxcvbnm.";
			this.redirect : false;
			this isLoaded : false;
		};
		this.loadRestaurant = this.loadRestaurant.bind(this);
		this.looper = this.looper.bind(this);
	}
	loadRestaurant() {    
		fetch(restaurantDataUrl)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				this.setState({
					isLoaded: true,
					//TODO: set new restaurant properties, once the exact format is known
				});
			},

			(error) => {
				console.log("DEBUG: loadRestaurant error");
				console.log(error);
				this.setState({
					isLoaded: true,
					error
				});
			}
		)
	}
	looper(tags) {
		var tagString = "";
		for (var i = 0; i < tags.length; i++) {
			if (i > 0) {
				tagString = tagString + ", " + tags[i];
			}
			else {
				tagString = tagString + tags[i];
			}
		}
		return tagString;
	}
	setRedirect = () => {
		this.setState({
			redirect: true
		})
	}

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to='/writeReview' />
		}
	}
	render() {
		<div id="restaurant">
		<h2>{this.restaurant.name()}</h2><br>
		<div id="restaurantPictures"><img src={this.restaurant.pictures[0]()} alt="Restaurant picture"></div>
		<div id="restaurantStats">Hintataso: {this.restaurant.priceLevel()}<br>
		Käyttäjien arvio: {this.restaurant.userScore()}<br>
		Allergiatunnisteet:<br>
		{this.looper(this.restaurant.allergyTags())}</div><br>
		<div id="restaurantDesc">{this.restaurant.description()}</div><br>
		{this.renderRedirect()}
		<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2" onClick={this.setRedirect}>Lisää arvostelu></Input><br>
		</ReviewList>
		</div>
	}
}