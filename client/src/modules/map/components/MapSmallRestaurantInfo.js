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
        mon:"Mon",
        tue:"Tue",
        wed:"Wed",
        thu:"Thu",
        fri:"Fri",
        sat:"Sat",
        sun:"Sun",
        enterToRestaurantPage:"Enter to restaurant page",
        openingHours:"Opening hours",
        overallRating: "Overall rating",
        serviceRating: "Service rating",
        varietyRating: "Variety rating",
        reliabilityRating: "Reliability rating",
        backToMap: "Back to map"
      },
      fi: {
        mon:"Ma",
        tue:"Ti",
        wed:"Ke",
        thu:"To",
        fri:"Pe",
        sat:"La",
        sun:"Su",
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
    return(
      <div className="restaurant-info">
        <div>
          <h1 className="restaurant-info-item" id="restaurantName">{this.props.restaurantInfo.name}</h1>
          <div className="restaurant-info-item" id="address">
            {this.props.restaurantInfo.city}, {this.props.restaurantInfo.postcode}, {this.props.restaurantInfo.address}
          </div>
          <div className="restaurant-info-item" id="contact">
            {strings.email}: {this.props.restaurantInfo.email}, {strings.website}: {this.props.restaurantInfo.website}
          </div>
          <div className="ratings">
            <div className="restaurant-info-item rating" id="overallReview">
              {strings.overallRating}: {this.props.restaurantInfo.overallRating}/5
            </div>
            <div className="restaurant-info-item rating" id="service">
              {strings.serviceRating}: {this.props.restaurantInfo.serviceRating}/5
            </div>
            <div className="restaurant-info-item rating" id="variety">
              {strings.varietyRating}: {this.props.restaurantInfo.varietyRating}/5
            </div>
            <div className="restaurant-info-item rating" id="reliability">
              {strings.reliabilityRating}: {this.props.restaurantInfo.reliabilityRating}/5
            </div>
        </div>
      </div>
      <div className="restaurant-info-item" id="openingHours">
        {strings.openingHours}:<br/>
        {strings.mon}: {this.props.restaurantInfo.openMon}<br/>
        {strings.tue}: {this.props.restaurantInfo.openTue}<br/>
        {strings.wed}: {this.props.restaurantInfo.openWed}<br/>
        {strings.thu}: {this.props.restaurantInfo.openThu}<br/>
        {strings.fri}: {this.props.restaurantInfo.openFri}<br/>
        {strings.sat}: {this.props.restaurantInfo.openSat}<br/>
        {strings.sun}: {this.props.restaurantInfo.openSun}<br/>
      </div>
      <div className="small-restaurant-info-btn-box">
        <NavLink
          className="restaurant-info-item RestaurantPageBtn"
          id="enterToRestaurantPageBtn"
          onMouseLeave={this.hover}
          tag={Link}
          to={"/"+this.props.language+"/restaurantPage?restaurantId="+this.props.restaurantInfo.id}
        >
          {strings.enterToRestaurantPage}
        </NavLink>
        <button
          className="RestaurantPageBtn"
          id="BackToMapBtn-Small-Restaurant-Info"
          onClick={this.props.CloseRestaurantInfo}
        >
          {strings.backToMap}
        </button>
      </div>
    </div>
    )
  }
}

export default MapSmallRestaurantInfo;
