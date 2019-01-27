/*In this file the page of selected restaurant is shown*/
import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ReactStars from 'react-stars';
import ReviewList from './Review_List.js';
import WriteReviewComponents from '../../writereview';
import Config from '../../../config.js';
/* Localization */
import LocalizedStrings from 'react-localization';
import WriteReview from '../../writereview/components/WriteReview.js';
import '../../../styles/restaurant.css'
const restaurantDataUrl = "http://localhost:3000/restaurant";

class Restaurant extends React.Component {
	constructor(props) {
		super(props);

		const { id } = this.props.match.params;
		this.state = {
			name : "TestiRavintola",
			pictures : ["", "", ""],
			priceLevel : 2,
			userScore : 3,
			allergyTags : ["Sipuliton", "Munaton", "Laktoositon"],
			openingHours : {monFri: "08.00 - 21.00", sat: "09.00 - 21.00", sun: "09.00 - 18.00"},
			description : "Tämä ravintola tarjoaa monipuolisia aterioita ja allergikoille sopivia vaihtoehtoja testitarkoituksessa.",
			id : id,
			redirect : false,
			isLoaded : false,
			modalState: false,
			error: null,
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
	}
	/*loads data from database, sets new values to the state*/
	componentDidMount() {
		fetch(restaurantDataUrl + "?restaurantId=" + this.state.id)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				if (result.restaurant.length == 0) {
					console.log('result length 0');
					this.setState({ isLoaded: true, error: 'No restaurants found', });
					return;
				}

				const restaurant = result.restaurant[0];
				this.setState({
					//Note: not all info seen in the mockup exist currently in the database, may require changing what to show?
					isLoaded: true,
					name : restaurant.name,
					userScore : restaurant.rating_overall,
					allergyTags : restaurant.restaurant_diet_stats,
					description : restaurant.email + ", " + restaurant.website + ", " + restaurant.street_address,
					id : restaurant.restaurant_id
				});
			},

			(error) => {
				console.log("DEBUG: loadRestaurant error");
				console.log(error);
				this.setState({
					isLoaded: true,
					error: error,
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
  //Toggles modal
	toggleModal() {
		this.setState({
			modalState: !this.state.modalState
		});
		console.log("showModal: Toggling modal to " + this.state.modalState)
	}
/*Renders the restaurant info, button to open the writing view and links the review list at the bottom*/
	render () {
		let strings = new LocalizedStrings({
		en:{
			priceLevel: "Price level: ",
			userRating: "User rating: ",
			allergyTags: "Allergy information: ",
			openingHours: ["Opening hours", "Mon: ","Tue: ","Wed: ","Thu: ","Fri: ","Sat: ", "Sun: "],
			addReview: "Add a review",
			description: "Description",
		},
		fi: {
			priceLevel: "Hintataso: ",
			userRating: "Käyttäjien arvio: ",
			allergyTags: "Allergiatunnisteet: ",
			openingHours: ["Aukioloajat","Ma: ","Ti: ","Ke: ","To: ","Pe: ","La: ", "Su: "],
			addReview: "Lisää arvostelu",
			description: "Kuvaus"
		}
		});
		strings.setLanguage(this.props.match.params.language);
		return (
			<div id="restaurant">
			<h2 className="restaurant-title">{this.state.name}</h2>
			<div id="restaurantPictures">
				<div className="restaurant-image-container">
					<img src={this.state.pictures[0]} alt="Restaurant picture1"></img>
				</div>
				<div className="restaurant-image-container">
					<img src={this.state.pictures[1]} alt="Restaurant picture2"></img>
				</div>
				<div className="restaurant-image-container">
					<img src={this.state.pictures[2]} alt="Restaurant picture3"></img>
				</div>
				<div id="restaurantOpeningHours" className="restaurant-image-container">
					{strings.openingHours[0]}
					<div>{strings.openingHours[1]}{this.state.openingHours.monFri}</div>
					<div>{strings.openingHours[2]}{this.state.openingHours.monFri}</div>
					<div>{strings.openingHours[3]}{this.state.openingHours.monFri}</div>
					<div>{strings.openingHours[4]}{this.state.openingHours.monFri}</div>
					<div>{strings.openingHours[5]}{this.state.openingHours.monFri}</div>
					<div>{strings.openingHours[6]}{this.state.openingHours.sat}</div>
					<div>{strings.openingHours[7]}{this.state.openingHours.sun}</div>
				</div>
			</div>
			<div className="restaurant-description-header">
				{strings.description}:
			</div>
			<div id="restaurantDesc">{this.state.description}
			</div>
			<div id="restaurantStats">
				<div className="inline-block-review">
					{strings.priceLevel}<ReactStars value={this.state.priceLevel} count={3} char='€' edit={false}/>
				</div>
				<div className="inline-block-review">
					{strings.userRating}<ReactStars value={this.state.userScore} edit={false}/>
				</div>
				<div className="inline-block-review">
					{strings.allergyTags}<br/>
					{this.looper(this.state.allergyTags)}
				</div>
			</div>
			<div id="review-restaurant-btn">
      	<WriteReview restaurantId={this.state.id} language={this.props.match.params.language} />
			</div>
			<ReviewList idFromParent={this.state.id} language={this.props.match.params.language}/>
			</div>
		);
	}
}
export default Restaurant;
