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
const restaurantDataUrl = "";

export default class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			this.reviewList.titles : ["Otsikko1", "Otsikko2"];
			this.reviewList.pictures : ["", ""];
			this.reviewList.reviews : ["", ""];
			this.reviewList.users : ["", ""];
			this.reviewList.allergyTags : [["", ""], ["", ""]];
			this.reviewList.relevance : [3, 2];
			this.reviewList.allergyAwareness: [3, 3];
			this.reviewList.serviceQuality : [2, 4];
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
					restaurants: result.restaurants
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

	render() {
		<div id="reviewList">
		
		</div>
	}
}