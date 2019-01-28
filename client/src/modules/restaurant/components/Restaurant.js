/*In this file the page of selected restaurant is shown*/
import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import '../../../styles/restaurant.css';
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
const MapApi = require('../../map/components/MapGlobalFunctions');
class Restaurant extends React.Component {
	constructor(props) {
		super(props);

		const { id } = this.props.match.params;
		this.state = {
			name : "",
			pictures : ["", "", ""],
			priceLevel : 0,
			userScore : 0,
			allergyTags : [],
			openingHours : {mon: "",tue:"",wed:"",thu:"",fri:"", sat:"", sun: ""},
			description : "",
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
					openingHours : {
						mon: MapApi.handleOpeningHour(restaurant.opens_mon,restaurant.closes_mon),
						tue: MapApi.handleOpeningHour(restaurant.opens_tue,restaurant.closes_tue),
						wed: MapApi.handleOpeningHour(restaurant.opens_wed,restaurant.closes_wed),
						thu: MapApi.handleOpeningHour(restaurant.opens_thu,restaurant.closes_thu),
						fri: MapApi.handleOpeningHour(restaurant.opens_fri,restaurant.closes_fri),
						sat: MapApi.handleOpeningHour(restaurant.opens_sat,restaurant.closes_sat),
						sun: MapApi.handleOpeningHour(restaurant.opens_sun,restaurant.closes_sun),
					},
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
			openingHours: ["Opening hours", "Mon: ","Tue: ","Wed: ","Thu: ","Fri: ","Sat: ", "Sun: "],
			addReview: "Add a review",
			description: "Description",
			cancel: "Cancel"
		},
		fi: {
			preTitle: "Ravintolan arvostelut: ",
			priceLevel: "Hintataso: ",
			userRating: "Käyttäjien arvio: ",
			allergyTags: "Allergiatunnisteet: ",
			openingHours: ["Aukioloajat","Ma: ","Ti: ","Ke: ","To: ","Pe: ","La: ", "Su: "],
			addReview: "Lisää arvostelu",
			description: "Kuvaus",
			cancel: "Peruuta"
		}
		});
		strings.setLanguage(this.props.match.params.language);
		var showFirstImage = true;
		if(this.state.pictures[0] == "")
		{
			showFirstImage = false;
		}
		var showSecondImage = true;
		if(this.state.pictures[1] == "")
		{
			showSecondImage = false;
		}
		var showThirdImage = true;
		if(this.state.pictures[2] == "")
		{
			showThirdImage = false;
		}
		return (
			<div class="mainContainer">
			<div id="restaurant" class="restaurant">
				<h2 className="restaurant-title">{this.state.name}</h2>
				<div id="restaurantPictures">
					{showFirstImage &&
					<div className="restaurant-image-container">
						<img src={this.state.pictures[0]} alt="Restaurant picture1"></img>
					</div>
					}
					{showSecondImage &&
						<div className="restaurant-image-container">
							<img src={this.state.pictures[1]} alt="Restaurant picture2"></img>
						</div>
					}
					{showThirdImage &&
						<div className="restaurant-image-container">
							<img src={this.state.pictures[2]} alt="Restaurant picture3"></img>
						</div>
					}
					<div id="restaurantOpeningHours" className="restaurant-image-container">
						{strings.openingHours[0]}
						<div>{strings.openingHours[1]}{this.state.openingHours.mon}</div>
						<div>{strings.openingHours[2]}{this.state.openingHours.tue}</div>
						<div>{strings.openingHours[3]}{this.state.openingHours.wed}</div>
						<div>{strings.openingHours[4]}{this.state.openingHours.thu}</div>
						<div>{strings.openingHours[5]}{this.state.openingHours.fri}</div>
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
					<div className="inline-block-review" id="restaurantPrice">
						{strings.priceLevel}<ReactStars value={this.state.priceLevel} count={3} char='€' edit={false}/>
					</div>
					<div className="inline-block-review" id="restaurantRating">
						{strings.userRating}<ReactStars value={this.state.userScore} edit={false}/>
					</div>
					<div className="inline-block-review" id="allergyTags">
						{strings.allergyTags}<br/>
						{this.looper(this.state.allergyTags)}
					</div>
				</div>
				<div id="review-restaurant-btn">
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
				</div>
				<div id="preTitle">{strings.preTitle}</div>
				<ReviewList idFromParent={this.state.id} language={this.props.match.params.language}/>
			</div>
			</div>
		);
	}
}
export default Restaurant;
