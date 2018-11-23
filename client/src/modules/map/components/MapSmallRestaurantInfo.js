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
          <div className="ratings">
            <div className="restaurant-info-item" id="overallReview">
              {strings.overallRating}: {this.props.restaurantInfo.overallRating}/5
            </div>
          <div className="restaurant-info-item" id="service">
            {strings.serviceRating}: {this.props.restaurantInfo.serviceRating}/5
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
      <NavLink className="restaurant-info-item" id="enterToRestaurantPageBtn" onMouseLeave={this.hover} tag={Link} to={"/"+this.props.language+"/restaurantPage"}>
        {strings.enterToRestaurantPage}
      </NavLink>
    </div>
    )
  }
}

export default MapSmallRestaurantInfo;
