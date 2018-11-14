import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	Popover, PopoverBody, PopoverHeader
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReviewList from './Review_List.js';
import WriteReview from '/client/src/modules/home';
const restaurantDataUrl = "/services/lambda/sipuliton-backend/restaurant";

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
			this.restaurant.id : 0;
			this.redirect : false;
			this isLoaded : false;
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.setRedirect = this.setRedirect.bind(this);
		this.renderRedirect = this.renderRedirect.bind(this);
	}
	componentDidMount() {    
		fetch(restaurantDataUrl)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				this.setState({
					isLoaded: true,
					this.restaurant.name : result.name;
					this.restaurant.userScore : result.rating_overall;
					this.restaurant.allergyTags : result.restaurant_diet_stats;
					this.restaurant.description : result.email + ", " + result.website + ", " result.street_address;
					this.restaurant.id : result.restaurant_id;
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
		if (Array.isArray(tags)) {
			for (var i = 0; i < tags.length; i++) {
				if (i > 0) {
					tagString = tagString + ", " + tags[i];
				}
				else {
					tagString = tagString + tags[i];
				}
			}
		}
		else {
			tagString = tags;
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
			//return <Redirect to='/writeReview' />
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
		<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2" onClick={this.togglePopover}>Lisää arvostelu></Input><br>
		<Popover placement="bottom" isOpen={this.state.popoverOpen} target="filter_popover" toggle={this.togglePopover}>
		<PopoverHeader></PopoverHeader>
        <PopoverBody>
		</WriteReview>
		</PopoverBody>
        </Popover>
		</ReviewList>
		</div>
	}
}