import React from 'react';
import {
  Button,
  NavItem,
  NavLink,} from 'reactstrap';

/* Map imports */
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import '../../../styles/map.css';

/* Router imports */
import { Link } from 'react-router-dom';

/* Localization */
import LocalizedStrings from 'react-localization';

class CustomMap extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.CloseRestaurantInfo = this.CloseRestaurantInfo.bind(this);

    //TODO: Fetch marker locations based on search or current location.

    //Mock restaurant green markers.
    let markers = [
      [[61.457239,23.848175],[1]],
      [[61.426239,23.854175],[2]],
      [[61.445239,23.839175],[3]],
      [[61.487239,23.808175],[4]],
      [[61.459239,23.918175],[5]],
      [[61.476239,23.768175],[6]],
      [[61.492239,23.798175],[7]]];

    //Mock restaurant grey markers.
    let greyMarks = [
      [[61.463871,23.829619],[8]],
      [[61.463999,23.830000],[9]],
      [[61.467252,23.851854],[10]]];

    this.state = {
      center: [61.450239,23.858175],
      zoom: 13,
      restaurantInfoOpen: false,
      mapClass:"full",
      restaurantInfo:{},
      greenMarkers: markers,
      greyMarkers: greyMarks,
      selectedRestaurant: 0
    }

  }

  //Method adds new marker to map.
  AddMarker(position){
    var markers = this.state.markers
    markers.push(position)
    this.setState({markers:markers})
  }


  OpenRestaurantInfo(position){
    var fixLat = position[0][0]-0.007
    this.setState({
      restaurantInfoOpen: true,
      mapClass:"mini",
      center: [fixLat,position[0][1]],
      zoom:15,
      selectedRestaurant: position[1][0]
    });

    //Implement restaurant info fetch.
    this.setState({
      restaurantInfo:{
        id:position[1][0],
        name:"Grilli",
        city:"Hervanta",
        postcode:"33990",
        address:"Insinöörinkatu 17",
        overallRating:"3.5",
        serviceRating:"4",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
      }
    })

    console.log("Restaurant id: "+position[1][0])
    this.render();
  }

  CloseRestaurantInfo(){
    this.setState({
      restaurantInfoOpen: false,
      mapClass:"full",
      selectedRestaurant: 0,
    });
    this.render();
  }

  render() {

    // icon for the search result
    const greenIcon = L.icon({
         iconUrl: require('../../../resources/GreenPin.png'),
         iconSize: [84,64],
         iconAnchor: [32, 64],
         popupAnchor: [-3, -76],
         shadowUrl: null,
         shadowSize: null,
         shadowAnchor: null
     });

     // icon for the non search result
     const greyIcon = L.icon({
          iconUrl: require('../../../resources/GreyPin.png'),
          iconSize: [84,64],
          iconAnchor: [32, 64],
          popupAnchor: [0, -55],
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null
      });

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
      <div>
        <Map center={this.state.center} zoom={this.state.zoom} className={this.state.mapClass}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.state.greenMarkers.map((position, idx) =>
            <Marker key={`marker-${idx}`} position={position[0]} icon={greenIcon}>
              <Popup onOpen={() => this.OpenRestaurantInfo(position)} onClose={this.CloseRestaurantInfo} className="HiddenPopUp"/>
            </Marker>
          )}
          {this.state.greyMarkers.map((position, idx) =>
            <Marker key={`marker-${idx}`} position={position[0]} icon={greyIcon}>
              <Popup onOpen={() => this.OpenRestaurantInfo(position)} onClose={this.CloseRestaurantInfo} className="HiddenPopUp"/>
            </Marker>
          )}
        </Map>
        {this.state.restaurantInfoOpen &&
          <div className="restaurant-info">
            <h1 className="restaurant-info-item" id="restaurantName">{this.state.restaurantInfo.name}</h1>
              <div className="restaurant-info-item" id="address">
                {this.state.restaurantInfo.city}, {this.state.restaurantInfo.postcode}, {this.state.restaurantInfo.address}
              </div>
            <div className="ratings">
              <div className="restaurant-info-item" id="overallReview">
                {strings.overallRating}: {this.state.restaurantInfo.overallRating}/5
              </div>
              <div className="restaurant-info-item" id="service">
                {strings.serviceRating}: {this.state.restaurantInfo.serviceRating}/5
              </div>
            </div>
            <div className="restaurant-info-item" id="openingHours">
              {strings.openingHours}:<br/>
              {strings.mon}: {this.state.restaurantInfo.openMon}<br/>
              {strings.tue}: {this.state.restaurantInfo.openTue}<br/>
              {strings.wed}: {this.state.restaurantInfo.openWed}<br/>
              {strings.thu}: {this.state.restaurantInfo.openThu}<br/>
              {strings.fri}: {this.state.restaurantInfo.openFri}<br/>
              {strings.sat}: {this.state.restaurantInfo.openSat}<br/>
              {strings.sun}: {this.state.restaurantInfo.openSun}<br/>
            </div>
            <NavLink className="restaurant-info-item" id="enterToRestaurantPageBtn" onMouseLeave={this.hover} tag={Link} to={"/"+this.props.language+"/restaurantPage"}>
              {strings.enterToRestaurantPage}
            </NavLink>
          </div>
        }
        </div>

    )
  }
}

export default CustomMap;
