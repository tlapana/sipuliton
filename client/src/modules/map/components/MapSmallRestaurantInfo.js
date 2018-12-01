import React from 'react';
import {
  Button,
  NavItem,
  NavLink,} from 'reactstrap';

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
        reliabilityRating: "Reliability rating"
      },
      fi: {
        openToday:"Auki tänään",
        enterToRestaurantPage:"Siirry ravintolan sivulle",
        openingHours:"Aukioloajat",
        overallRating: "Kokonaisarvosana",
        serviceRating: "Palvelu",
        varietyRating: "Valinnanvara",
        reliabilityRating: "Luotettavuus",
        email:"Sähköposti osoite",
        website:"Verkkosivu"
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
    return(
      <div className="restaurant-info">
        <div>
          <h1 className="restaurant-info-item" id="restaurantName">{this.props.restaurantInfo.name}</h1>
          <div className="restaurant-info-item" id="address">
            {this.props.restaurantInfo.city}, {this.props.restaurantInfo.postcode}, {this.props.restaurantInfo.address}
          </div>
          <div className="ratings">
            <div className="restaurant-info-item rating" id="overallReview">
              {strings.overallRating}: {this.props.restaurantInfo.overallRating}/5
            </div>
        </div>
      </div>
      <div className="restaurant-info-item" id="openingHours">
        {strings.openingHours}:<br/>
        {strings.openToday}: {todayOpenHours}<br/>
      </div>
      <NavLink
        className="restaurant-info-item RestaurantPageBtn"
        id="enterToRestaurantPageBtn"
        onMouseLeave={this.hover}
        tag={Link}
        to={"/"+this.props.language+"/restaurantPage?restaurantId="+this.props.restaurantInfo.id}
      >
        {strings.enterToRestaurantPage}
      </NavLink>
    </div>
    )
  }
}

export default MapSmallRestaurantInfo;
