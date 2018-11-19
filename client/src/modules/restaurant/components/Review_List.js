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
			titles : [],
			pictures : [],
			reviews : [],
			users : [],
			allergyTags : [],
			relevance : [],
			allergyAwareness: [],
			serviceQuality : [],
			numberOfRevs : this.titles.length - 1,
			pageNumber : 0,
			pageSize : 20,
			isLoaded : false
		};
		this.loadReviews = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.changeReview = this.changeReview.bind(this);
	}
	componentDidMount() {
		fetch(reviewsDataUrl + "?restaurantId=" + this.id + "&pageNumber=" + this.pageNumber + "&pageSize=" + this.pageSize)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				var i;
				for (i = 0; i < result.length; i++) {
					var obj = result[i];
					var titls = titls.push(obj.title);
					var revws = revws.push(obj.free_text);
					var usrs = usrs.push(obj.user_id);
					var rlvnce = rlvnce.push(obj.rating_reliability);
					var allergyAware = allergyAware.push(obj.rating_variety);
					var serviceQual = serviceQual.push(obj.rating_service_and_quality);
				}
				this.setState({
					isLoaded: true,
					titles : titls,
					reviews : revws,
					users : usrs,
					relevance : rlvnce,
					allergyAwareness: allergyAware,
					serviceQuality : serviceQual,
					numberOfRevs : this.titles.length - 1
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
		if (reviewIndex < this.numberOfRevs) {
			reviewIndex++;
		}
		else {
			reviewIndex = 0;
		}
		this.setState({
			isLoaded: true,
		});
	}
	render() {
		return (
			<div id="reviewList" onClick={this.changeReview()}>
			<h3>{this.titles[reviewIndex]()}</h3>
			<div id="reviewPicture"><img src={this.pictures[reviewIndex]()} alt="Review picture"></img></div><br/>
			<div id="reviewText">{this.reviews[reviewIndex]()}</div><br/>
			<div id="reviewUser">Arvostelija: {this.users[reviewIndex]()}</div>
			<div id="reviewAllergies">Allergiatunnisteet: {this.looper(this.allergyTags[reviewIndex]())}</div><br/>
			<div id="reviewRelevance">Vastasi hakua: {this.relevance[reviewIndex]()}</div><br/>
			<div id="reviewAwareness">Allergioiden huomioon otto: {this.allergyAwareness[reviewIndex]()}</div><br/>
			<div id="reviewQuality">Palvelu ja laatu: {this.serviceQuality[reviewIndex]()}</div>
			</div>
		);
	}
}