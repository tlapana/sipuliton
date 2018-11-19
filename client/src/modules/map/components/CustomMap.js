import React from 'react';
import {Button} from 'reactstrap';

/* Map imports */
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import '../../../styles/map.css';

class CustomMap extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      lat: 61.450239,
      lng: 23.858175,
      zoom: 13,
      restaurantInfoOpen: false,
      mapClass:"full",
      restaurantInfo:{},
    }
    this.CloseRestaurantInfo = this.CloseRestaurantInfo.bind(this);
    this.EnterToRestaurantPage = this.EnterToRestaurantPage.bind(this);

    //TODO: Fetch marker locations based on search or current location.
  }

  EnterToRestaurantPage(){
    //TODO: Implement redirection to restaurant page
  }

  OpenRestaurantInfo(position){
    var fixLat = position[0]-0.05
    this.setState({
      restaurantInfoOpen: true,
      mapClass:"mini",
      lat: fixLat,
      lng: position[1],
      zoom:15
    });
    this.render();
    //Implement restaurant info fetch.
    this.setState({
      restaurantInfo:{
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

  }

  CloseRestaurantInfo(){
    this.setState({
      restaurantInfoOpen: false,
      mapClass:"full"
    });
    this.render();
  }

  render() {

    const position = [this.state.lat, this.state.lng]
    //icon for the search result
    //TODO: Create and change icons.
    const redIcon = L.icon({
         iconUrl: require('../../../resources/suomilippu_logo.ico'),
         iconSize: [64,64],
         iconAnchor: [32, 64],
         popupAnchor: [-3, -76],
         shadowUrl: null,
         shadowSize: null,
         shadowAnchor: null
     });

     // icon for the non search result
    //TODO: Create and change icons.
     const greyIcon = L.icon({
          iconUrl: require('../../../resources/englanninlippu_logo.ico'),
          iconSize: [64,64],
          iconAnchor: [32, 64],
          popupAnchor: [0, -55],
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null
      });
    return(
      <div>
        <Map center={position} zoom={this.state.zoom} className={this.state.mapClass}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[61.450239,23.858175]} icon={redIcon} >
            <Popup onOpen={() => this.OpenRestaurantInfo([61.450239,23.858175])} onClose={this.CloseRestaurantInfo} className="HiddenPopUp"/>
          </Marker>
          <Marker position={[61.451239, 23.859175]} icon={greyIcon}>
            <Popup onOpen={() => this.OpenRestaurantInfo([61.451239, 23.859175])} onClose={this.CloseRestaurantInfo} className="HiddenPopUp"/>
          </Marker>
        </Map>
        {this.state.restaurantInfoOpen &&
          <div>
            <h1 id="restaurantName">{this.state.restaurantInfo.name}</h1>
            <div id="address">
              {this.state.restaurantInfo.city}, {this.state.restaurantInfo.postcode}
              <br/>
              {this.state.restaurantInfo.address}
            </div>
            <div id="overallReview">
              Kokonais arvosana: {this.state.restaurantInfo.overallRating}/5
            </div>
            <div id="service">
              Palvelu: {this.state.restaurantInfo.serviceRating}/5
            </div>
            <div id="openingHours">
              Aukioloajat:<br/>
              Ma: {this.state.restaurantInfo.openMon}<br/>
              Ti: {this.state.restaurantInfo.openTue}<br/>
              Ke: {this.state.restaurantInfo.openWed}<br/>
              To: {this.state.restaurantInfo.openThu}<br/>
              Pe: {this.state.restaurantInfo.openFri}<br/>
              La: {this.state.restaurantInfo.openSat}<br/>
              Su: {this.state.restaurantInfo.openSun}<br/>
            </div>
            <Button id="enterToRestaurantPageBtn" onClick={this.EnterToRestaurantPage}>
              Siirry ravintolan sivulle
            </Button>
          </div>
        }
        </div>

    )
  }
}

export default CustomMap;
