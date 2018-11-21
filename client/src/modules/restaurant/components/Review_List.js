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
var numberOfRevs = 0;

export default class ReviewList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			titles : ["", ""],
			pictures : ["", ""],
			reviews : ["", ""],
			users : ["", ""],
			allergyTags : [["Sipuliton", "Munaton"], ["Sipuliton", "Munaton"]],
			relevance : [0, 0],
			allergyAwareness: [0, 0],
			serviceQuality : [0, 0],
			pageNumber : 0,
			pageSize : 20,
			isLoaded : false
		};
		this.loadReviews = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.changeReview = this.changeReview.bind(this);
		numberOfRevs = this.state.titles.length - 1;
	}
	componentDidMount() {
		const { resId } = this.props.match.params;
		fetch(reviewsDataUrl + "?restaurantId=" + resId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize)
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
					serviceQuality : serviceQual
				});
				numberOfRevs = this.state.titles.length - 1;
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
		{/*if (typeof tags !== 'undefined') {
			for (var i = 0; i < tags.length; i++) {
			if (i > 0) {
				tagString = tagString + ", " + tags[i];
			}
			else {
				tagString = tagString + tags[i];
			}
		}
		}*/}
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
			<h3>{this.state.titles[reviewIndex]}</h3>
			<div id="reviewPicture"><img src={this.state.pictures[reviewIndex]} alt="Review picture"></img></div><br/>
			<div id="reviewText">{this.state.reviews[reviewIndex]}</div><br/>
			<div id="reviewUser">Arvostelija: {this.state.users[reviewIndex]}</div>
			<div id="reviewAllergies">Allergiatunnisteet: {this.looper(this.state.allergyTags[reviewIndex])}</div><br/>
			<div id="reviewRelevance">Vastasi hakua: {this.state.relevance[reviewIndex]}</div><br/>
			<div id="reviewAwareness">Allergioiden huomioon otto: {this.state.allergyAwareness[reviewIndex]}</div><br/>
			<div id="reviewQuality">Palvelu ja laatu: {this.state.serviceQuality[reviewIndex]}</div>
			</div>
		);
	}
}