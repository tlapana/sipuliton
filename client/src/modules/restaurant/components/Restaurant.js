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
import WriteReview from '../../home';
const restaurantDataUrl = "/services/lambda/sipuliton-backend/restaurant";

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//How the restaurant properties is made up, for now
			name : "Test",
			pictures : ["", "", ""],
			priceLevel : 2,
			userScore : 3,
			allergyTags : ["Sipuliton", "Munaton"],
			openingHours : {monFri: "08.00 - 21.00", sat: "09.00 - 21.00", sun: "09.00 - 18.00"},
			description : "Qwertyuiop. Asdfghjkl.<br/>Zxcvbnm.",
			id : 1,
			redirect : false,
			isLoaded : false,
			popoverOpen: false
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		//this.setRedirect = this.setRedirect.bind(this);
		//this.renderRedirect = this.renderRedirect.bind(this);
		this.togglePopover = this.togglePopover.bind(this);
	}
	componentDidMount() {    
		fetch(restaurantDataUrl + "?restaurantId=" + this.id)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				this.setState({
					//Note: not all info seen in the mockup exist currently in the database, may require changing what to show?
					isLoaded: true,
					name : result.name,
					userScore : result.rating_overall,
					allergyTags : result.restaurant_diet_stats,
					description : result.email + ", " + result.website + ", " + result.street_address,
					id : result.restaurant_id
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
	/*setRedirect = () => {
		this.setState({
			redirect: true
		})
	}

	renderRedirect = () => {
		if (this.state.redirect) {
			//return <Redirect to='/writeReview' />
		}
	}*/
	//Instead of redirecting, we use Popover
	togglePopover() {
		this.setState({
		popoverOpen: !this.state.popoverOpen
		});
		//console.log("Toggling popover, new state is: " + this.state.popoverOpen);
	}

	render () {
		return (
			<div id="restaurant">
			<h2>{this.name()}</h2><br/>
			<div id="restaurantPictures">
			<img src={this.pictures[0]()} alt="Restaurant picture1"></img><br/>
			<img src={this.pictures[1]()} alt="Restaurant picture2"></img>
			<img src={this.pictures[2]()} alt="Restaurant picture3"></img>
			</div>
			<div id="restaurantStats">Hintataso: {this.restaurant.priceLevel()}<br/>
			Käyttäjien arvio: {this.userScore()}<br/>
			Allergiatunnisteet:<br/>
			{this.looper(this.allergyTags())}</div><br/>
			<div id="restaurantDesc">{this.description()}</div><br/>
			//{this.renderRedirect()}
			<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2" onClick={this.togglePopover}>Lisää arvostelu></Input><br/>
			//render review writing view as a popover element, after the button above has been clicked
			<Popover placement="bottom" isOpen={this.state.popoverOpen} target="filter_popover" toggle={this.togglePopover}>
			<PopoverHeader></PopoverHeader>
			<PopoverBody>
			<WriteReview/>
			</PopoverBody>
			</Popover>
			//render the reviews list from its own file
			<ReviewList/>
			</div>
		);
	}
}