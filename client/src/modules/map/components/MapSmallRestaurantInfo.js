import React from 'react';
import {
  Button,
  NavItem,
  NavLink,} from 'reactstrap';
import ReactStars from 'react-stars';
import '../../../styles/map.css';


/* Router imports */
import { Link } from 'react-router-dom';

/* Localization */
import LocalizedStrings from 'react-localization';


class MapSmallRestaurantInfo extends React.Component {

  render() {

    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        openToday:"Opening hours today",
        enterToRestaurantPage:"Enter to restaurant page",
        openingHours:"Opening hours",
        overallRating: "Overall rating",
        serviceRating: "Service rating",
        varietyRating: "Variety rating",
        reliabilityRating: "Reliability rating",
        backToMap: "Back to map"
      },
      fi: {
        openToday:"Auki tänään",
        enterToRestaurantPage:"Siirry ravintolan sivulle",
        openingHours:"Aukioloajat",
        overallRating: "Kokonaisarvosana",
        serviceRating: "Palvelu",
        varietyRating: "Valinnanvara",
        reliabilityRating: "Luotettavuus",
        email:"Sähköpostiosoite",
        website:"Verkkosivu",
        backToMap: "Takaisin karttaan"
      }
    });
    strings.setLanguage(this.props.language);

    var d = new Date();
    var n = d.getDay()
    var todayOpenHours = "";
    if(n === 0){
      todayOpenHours = this.props.restaurantInfo.openSun
    }
    if(n === 1){
      todayOpenHours = this.props.restaurantInfo.openMon
    }
    if(n === 2){
      todayOpenHours = this.props.restaurantInfo.openTue
    }
    if(n === 3){
      todayOpenHours = this.props.restaurantInfo.openWed
    }
    if(n === 4){
      todayOpenHours = this.props.restaurantInfo.openThu
    }
    if(n === 5){
      todayOpenHours = this.props.restaurantInfo.openFri
    }
    if(n === 6){
      todayOpenHours = this.props.restaurantInfo.openSat
    }

    var additionalClassName = this.props.pinColor+"-restaurant"
    var fullClass = "restaurant-info "+additionalClassName
    return(
      <div className={fullClass}>
        <div>
          <h3 className="restaurant-info-item restaurant-heading" id="restaurantName">
            {this.props.restaurantInfo.name}
          </h3>
          <div className="restaurant-info-item" id="address">
            {this.props.restaurantInfo.city}, {this.props.restaurantInfo.postcode},<br/> {this.props.restaurantInfo.address}
          </div>
          <div className="ratings">
            <div className="restaurant-info-item rating" id="overallReview">
              <ReactStars
                value = {this.props.restaurantInfo.overallRating}
                count = {5}
                size = {24}
                edit={false}
              />
              <ReactStars
                value = {this.props.restaurantInfo.pricingRating}
                count = {3}
                size = {24}
                char = '€'
                half = {false}
                edit={false}
              />
            </div>

        </div>
      </div>
      <div className="restaurant-info-item" id="openingHours">
        {strings.openToday}: {todayOpenHours}<br/>
      </div>
      <div className="small-restaurant-info-btn-box">
        <NavLink
          className="restaurant-info-item RestaurantPageBtn btn main-btn"
          id="enterToRestaurantPageBtn"
          onMouseLeave={this.hover}
          tag={Link}
          to={"/"+this.props.language+"/restaurant/"+this.props.restaurantInfo.id}
        >
          {strings.enterToRestaurantPage}
        </NavLink>
      </div>
    </div>
    )
  }
}

export default MapSmallRestaurantInfo;
