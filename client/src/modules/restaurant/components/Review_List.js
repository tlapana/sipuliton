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
const reviewsDataUrl = "/services/lambda/sipuliton-backend/reviews";
var reviewIndex = 0;

export default class ReviewList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			this.reviewList.titles : [],
			this.reviewList.pictures : [],
			this.reviewList.reviews : [],
			this.reviewList.users : [],
			this.reviewList.allergyTags : [],
			this.reviewList.relevance : [],
			this.reviewList.allergyAwareness: [],
			this.reviewList.serviceQuality : [],
			this.reviewList.numberOfRevs : this.reviewList.titles.length - 1,
			this.pageNumber : 0,
			this.pageSize : 20,
			this isLoaded : false
		};
		this.loadReviews = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.changeReview = this.changeReview.bind(this);
	}
	componentDidMount() {
		fetch(reviewsDataUrl + "?restaurantId=" + restaurant.id + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				this.setState({
					isLoaded: true;
					for (var i = 0; i < result.length; i++) {
						var obj = result[i];
						this.reviewList.titles : this.reviewList.titles.push(obj.title);
						this.reviewList.reviews : this.reviewList.reviews.push(obj.free_text);
						this.reviewList.users : this.reviewList.users.push(obj.user_id);
						this.reviewList.relevance : this.reviewList.relevance.push(obj.rating_reliability);
						this.reviewList.allergyAwareness: this.reviewList.allergyAwareness.push(obj.rating_variety);
						this.reviewList.serviceQuality : this.reviewList.serviceQuality.push(obj.rating_service_and_quality);
					}
					this.reviewList.numberOfRevs : this.reviewList.titles.length - 1;
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