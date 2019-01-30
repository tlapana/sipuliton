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
import '../../../styles/restaurant.css'
import ReactStars from 'react-stars';
/* Localization */
import LocalizedStrings from 'react-localization';
import Config from '../../../config.js';
const reviewsDataUrl = Config.backendAPIPaths.BASE+"/reviews";

class ReviewList extends React.Component {
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
			pageNumber : 0,
			pageSize : 20,
			numberOfRevs: 0,
			isLoaded : false
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.looper = this.looper.bind(this);
		this.renderReviews = this.renderReviews.bind(this);
	}
/*When the component mounts, load reviews from the db based on given specs like the id*/
	componentDidMount() {
		const resId = this.props.idFromParent;
		var lang = "fi";
		if(this.props.language != undefined)
		{
			lang = this.props.language;
		}
		fetch(reviewsDataUrl + "?restaurantId=" + resId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize+"&language="+lang)
		.then(res => res.json())
		.then(
			(result) => {
				console.log("DEBUG: loadRestaurant success");
				console.log(result);
				var i;

        /* Initialize arrays here first, so they exist outside the loop */
				var titls = [];
				var revws = [];
				var usrs = [];
				var rlvnce = [];
				var allergyAware = [];
				var serviceQual = [];
				var tags = [];

				/*no looping in setState, so build the arrays here first*/
				for (i = 0; i < result.reviews.length; i++) {
					var obj = result.reviews[i];
					titls.push(obj.title);
					revws.push(obj.free_text);
					usrs.push(obj.name);
					rlvnce.push(obj.rating_reliability);
					allergyAware.push(obj.rating_variety);
					serviceQual.push(obj.rating_service_and_quality);
					if(obj.diets.length > 0 && obj.diets[0] !== null)
					{
						tags.push(obj.diets);
					}
					else
					{
						tags.push(["-"]);
					}
				}
				//console.log(usrs);
        //console.log("titls:")
        //console.log(titls);
        //console.log("revws:")
        //console.log(revws)

				this.setState({
					isLoaded: true,
					titles : titls,
					reviews : revws,
					users : usrs,
					relevance : rlvnce,
					allergyAwareness: allergyAware,
					serviceQuality : serviceQual,
					numberOfRevs : titls.length,
					allergyTags: tags,
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
/*Function that loops through the reviews data and renders them into the reviews list*/
	renderReviews() {
		let strings = new LocalizedStrings({
			en:{
				preTitle: "Restaurant's reviews ",
				reviewer: "Reviewer: ",
				allergyTags: "Allergy information: ",
				relevance: "Relevance for the search: ",
				allergyAwareness: "Allergy awareness: ",
				quality: "Service and quality: ",
				nextReview:"Next review",
				previousReview:"Previous review"
			},
			fi: {
				preTitle: "Ravintolan arvostelut ",
				reviewer: "Arvostelija: ",
				allergyTags: "Allergiatunnisteet: ",
				relevance: "Vastasi hakua: ",
				allergyAwareness: "Allergioiden huomioon otto: ",
				quality: "Palvelu ja laatu: ",
				nextReview: "Seuraava arvostelu",
				previousReview:"Edellinen arvostelu"
			}
		});
		strings.setLanguage(this.props.language);
		let list = [];
		for (let reviewIndex = 0; reviewIndex < this.state.numberOfRevs; reviewIndex++) {
			var showImage=true;
			if(this.state.pictures[this.state.reviewIndex] != "" || this.state.pictures[this.state.reviewIndex] != undefined)
			{
				showImage=false;
			}
			list.push(
				<div className="reviewListItem" id="reviewList">
					<h3 className="review-title">{this.state.titles[reviewIndex]}</h3>
					<div id="review-ratings">
						<div id="reviewRelevance" className="inline-block-review">{strings.relevance}
							<ReactStars value={this.state.relevance[reviewIndex]} edit={false}/>
						</div>
						<div id="reviewAwareness" className="inline-block-review">{strings.allergyAwareness}
							<ReactStars value={this.state.allergyAwareness[reviewIndex]} edit={false}/>
						</div>
						<div id="reviewQuality" className="inline-block-review">{strings.quality}
							<ReactStars value={this.state.serviceQuality[reviewIndex]} edit={false}/>
						</div>
					</div>
					{showImage && <div id="reviewPicture"><img src={this.state.pictures[reviewIndex]} alt="Review picture"></img></div>}
					<div id="reviewText">{this.state.reviews[reviewIndex]}</div>
					<div id="reviewer-info">
						<div id="reviewUser" className="inline-block-review">{strings.reviewer}{this.state.users[reviewIndex]}</div>
						<div id="reviewAllergies" className="inline-block-review">{strings.allergyTags}{this.looper(this.state.allergyTags[reviewIndex])}</div>
					</div>
				</div>
		);
		}
		return list;
	}
/*Render the items shown in a scrollable list*/
	render() {
		return (
			<div class="reviewContainer">
				{this.renderReviews()}
			</div>
		);
	}
}
export default ReviewList;
