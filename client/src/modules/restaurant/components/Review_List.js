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
const reviewsDataUrl = "";
var reviewIndex = 0;

export default class ReviewList extends React.Component {
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
			this.reviewList.numberOfRevs : this.reviewList.titles.length - 1;
			this isLoaded : false;
		};
		this.loadReviews = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.changeReview = this.changeReview.bind(this);
	}
	componentDidMount() {    
		fetch(reviewsDataUrl)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				this.setState({
					isLoaded: true;
					//TODO: set the review contents, once the exact format is known
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
	changeReview() {
		if (reviewIndex < this.reviewList.numberOfRevs) {
			reviewIndex++;
		}
		else {
			reviewIndex = 0;
		}
		this.setState({
			isLoaded: true;
		});
	}
	render() {
		<div id="reviewList" onClick={this.changeReview()}>
		<h3>{this.reviewList.titles[reviewIndex]()}</h3>
		<div id="reviewPicture"><img src={this.reviewList.pictures[reviewIndex]()} alt="Review picture"></div><br>
		<div id="reviewText">{this.reviewList.reviews[reviewIndex]()}</div><br>
		<div id="reviewUser">Arvostelija: {this.reviewList.users[reviewIndex]()}</div>
		<div id="reviewAllergies">Allergiatunnisteet: {this.looper(this.reviewIndex.allergyTags[reviewIndex]())}</div><br>
		<div id="reviewRelevance">Vastasi hakua: {this.reviewList.relevance[reviewIndex]()}</div><br>
		<div id="reviewAwareness">Allergioiden huomioon otto: {this.reviewList.allergyAwareness[reviewIndex]()}</div><br>
		<div id="reviewQuality">Palvelu ja laatu: {this.reviewList.serviceQuality[reviewIndex]()}</div>
		</div>
	}
}
export default ReviewList;