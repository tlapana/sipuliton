/*In this file the page of selected restaurant is shown*/
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
const restaurantDataUrl = "http://localhost:3000/restaurant";

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name : "TestiRavintola",
			pictures : ["", "", ""],
			priceLevel : 2,
			userScore : 3,
			allergyTags : ["Sipuliton", "Munaton", "Laktoositon"],
			openingHours : {monFri: "08.00 - 21.00", sat: "09.00 - 21.00", sun: "09.00 - 18.00"},
			description : "Tämä ravintola tarjoaa monipuolisia aterioita ja allergikoille sovivia vaihtoehtoja testitarkoituksessa.",
			id : 1,
			redirect : false,
			isLoaded : false,
			popoverOpen: false
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.togglePopover = this.togglePopover.bind(this);
	}
	/*loads data from database, sets new values to the state*/
	componentDidMount() {
		const { resId } = this.props.match.params;
		fetch(restaurantDataUrl + "?restaurantId=" + resId)
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
	/*Function used to loop through arrays*/
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
		return tagString;
	}
	/*Instead of redirecting, we use Popover*/
	togglePopover() {
		this.setState({
		popoverOpen: !this.state.popoverOpen
		});
		//console.log("Toggling popover, new state is: " + this.state.popoverOpen);
	}
/*Renders the restaurant info, button to open the writing view and links the review list at the bottom*/
	render () {
		return (
			<div id="restaurant">
			<h2>{this.state.name}</h2><br/>
			<div id="restaurantPictures">
			<img src={this.state.pictures[0]} alt="Restaurant picture1"></img><br/>
			<img src={this.state.pictures[1]} alt="Restaurant picture2"></img>
			<img src={this.state.pictures[2]} alt="Restaurant picture3"></img>
			</div>
			<div id="restaurantStats">Hintataso: {this.state.priceLevel}<br/>
			Käyttäjien arvio: {this.state.userScore}<br/>
			Allergiatunnisteet:<br/>
			{this.looper(this.state.allergyTags)}</div><br/>
			<div id="restaurantDesc">{this.state.description}</div><br/>
			<Input type="button" value="Lisää arvostelu" className="btn btn-primary mb-2" onClick={this.togglePopover()}>Lisää arvostelu></Input><br/>
			<Popover placement="bottom" isOpen={this.state.popoverOpen} toggle={this.togglePopover()}>
			<PopoverHeader></PopoverHeader>
			<PopoverBody>
			<WriteReview/>
			</PopoverBody>
			</Popover>
			<ReviewList/>
			</div>
		);
	}
}