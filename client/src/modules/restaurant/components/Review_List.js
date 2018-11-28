/*In this file the reviews list of the viewed restaurant is rendered*/
import React from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import {
	Button,
	Input,
	Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const reviewsDataUrl = "http://localhost:3000/reviews";

class ReviewList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			titles : ["Perus ravintola", "Loistavaa"],
			pictures : ["", ""],
			reviews : ["Tämä ravintola oli hyvää keskitasoa, ei mitään yllättävää.", "Uskomattoman hyvää ruokaa. Halpaa ja terveellistäkin kaiken lisäksi."],
			users : ["Juha", "Tuomas"],
			allergyTags : [["Sipuliton", "Munaton"], ["Sipuliton", "Munaton"]],
			relevance : [3, 2],
			allergyAwareness: [2, 4],
			serviceQuality : [3, 5],
			pageNumber : 0,
			pageSize : 20,
			reviewIndex: 0,
			numberOfRevs: 1,
			isLoaded : false
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.changeReview = this.changeReview.bind(this);
	}
/*When the component mounts, load reviews from the db based on given specs like the id*/
	componentDidMount() {
		const { resId } = this.props.idFromParent;
		fetch(reviewsDataUrl + "?restaurantId=" + resId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				var i;
				/*no looping in setState, so build the arrays here first*/
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
					numberOfRevs : titls.length - 1
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
		);
	}
/*Function that loops through an array and builds a string out of it*/
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
/*Function that changes the review shown, when clicked on it*/
	changeReview() {
		if (this.state.reviewIndex < this.state.numberOfRevs) {
			this.setState({
				reviewIndex: this.state.reviewIndex + 1,
				isLoaded: true
			});
		}
		else {
			this.setState({
				reviewIndex: 0,
				isLoaded: true
			});
		}
	}
/*Render the items shown in review inside a div that can be clicked to show another review*/
	render() {
		return (
			<div id="reviewList" onClick={this.changeReview}>
				<h3>{this.state.titles[this.state.reviewIndex]}</h3>
				<div id="reviewPicture"><img src={this.state.pictures[this.state.reviewIndex]} alt="Review picture"></img></div><br/>
				<div id="reviewText">{this.state.reviews[this.state.reviewIndex]}</div><br/>
				<div id="reviewUser">Arvostelija: {this.state.users[this.state.reviewIndex]}</div>
				<div id="reviewAllergies">Allergiatunnisteet: {this.looper(this.state.allergyTags[this.state.reviewIndex])}</div><br/>
				<div id="reviewRelevance">Vastasi hakua: {this.state.relevance[this.state.reviewIndex]}</div><br/>
				<div id="reviewAwareness">Allergioiden huomioon otto: {this.state.allergyAwareness[this.state.reviewIndex]}</div><br/>
				<div id="reviewQuality">Palvelu ja laatu: {this.state.serviceQuality[this.state.reviewIndex]}</div>
			</div>
		);
	}
}
export default ReviewList;