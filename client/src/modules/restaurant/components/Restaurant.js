/*In this file the page of selected restaurant is shown*/
import React from 'react';
import '../../../styles/restaurant.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactStars from 'react-stars';
import ReviewList from './Review_List.js';
/* Localization */
import LocalizedStrings from 'react-localization';

import WriteReview from '../../writereview/components/WriteReview.js';

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
				if (result.restaurant.length === 0) {
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
			preTitle: "Restaurant's reviews: ",
			priceLevel: "Price level: ",
			userRating: "User rating: ",
			allergyTags: "Allergy information: ",
			openingHours: [" Opening hours - Mon-Fri: ", " Sat: ", " Sun: "],
			addReview: "Add a review",
      cancel: "Cancel"
		},
		fi: {
			preTitle: "Ravintolan arvostelut: ",
			priceLevel: "Hintataso: ",
			userRating: "Käyttäjien arvio: ",
			allergyTags: "Allergiatunnisteet: ",
			openingHours: [" Aukioloajat - Ma-Pe: ", " La: ", " Su: "],
			addReview: "Lisää arvostelu",
      cancel: "Peruuta"
		}
		});
		strings.setLanguage(this.props.match.params.language);
		return (
			<div class="mainContainer">
			<div class="restaurant">
			<h2>{this.state.name}</h2>
			<div id="restaurantPrice">{strings.priceLevel}<ReactStars value={this.state.priceLevel} count={3} char='€' edit={false}/></div>
			<div id="restaurantRating">{strings.userRating}<ReactStars value={this.state.userScore} edit={false}/></div>
			<div id="allergyTags">{strings.allergyTags}<br/>
			{this.looper(this.state.allergyTags)}</div>
			<div id="restaurantDesc">{this.state.description} 
			{strings.openingHours[0]}{this.state.openingHours.monFri}{strings.openingHours[1]}{this.state.openingHours.sat}{strings.openingHours[2]}{this.state.openingHours.sun}</div>
			<div class="buttonContainer"><Button color="primary" value="Lisää arvostelu" onClick={this.toggleModal}>{strings.addReview}</Button></div>
			<Modal isOpen={this.state.modalState} toggle={this.toggleModal} className="writeReview">
			<ModalHeader></ModalHeader>
			<ModalBody className="writeReview">
			<WriteReview restaurantId={this.state.id} language={this.props.match.params.language} />
			</ModalBody>
			<ModalFooter>
            <div class="buttonContainer"><Button color="primary" onClick={this.toggleModal}>{strings.cancel}</Button></div>
			</ModalFooter>
			</Modal>
			<div id="preTitle">{strings.preTitle}</div>
			</div>
			<div class="reviewList"><ReviewList idFromParent={this.state.id} language={this.props.match.params.language}/></div>
			</div>
		);
	}
}
export default Restaurant;