import React from 'react';
import {
  Button,
  NavItem,
  NavLink,} from 'reactstrap';

/* Map imports */
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet'
import L from 'leaflet';
import '../../../styles/map.css';

/* Location imports */
import {geolocated} from 'react-geolocated';

/* Router imports */
import { Link } from 'react-router-dom';

/* Localization */
import LocalizedStrings from 'react-localization';

/* Restaurant info */
import MapSmallRestaurantInfo from './MapSmallRestaurantInfo'

class CustomMap extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.CloseRestaurantInfo = this.CloseRestaurantInfo.bind(this);
    //TODO: Fetch marker locations based on search or current location.

    this.state = {
      center: [61.450239,23.858175],
      zoom: 13,
      restaurantInfoOpen: false,
      mapClass:"full",
      restaurantInfo:{},
      greenMarkers: [],
      greyMarkers: [],
      selectedRestaurant: 0
    }

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

    // your current location marker
    const curLocMark = L.icon({
         iconUrl: require('../../../resources/CurrentLocationMark.png'),
         iconSize: [104,74],
         iconAnchor: [32, 64],
         popupAnchor: [20, -55],
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
        youAreHere: "You are here!",
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
        youAreHere: "Olet tässä!",
      }
    });
    strings.setLanguage(this.props.language);
    var center = this.state.center
    if(this.props.latitude !== undefined && this.props.longitude !== undefined){
      center = [this.props.latitude,this.props.longitude]
    }
    var greyMarkers = [];
    var greenMarkers = [];
    if(this.props.greyMarkersData !== undefined){
      greyMarkers = this.props.greyMarkersData;
    }
    if(this.props.greenMarkersData !== undefined){
      greenMarkers = this.props.greenMarkersData;
    }
    console.log(center);
    return(
        <div>
          <Map
            center={center}
            zoom={this.state.zoom}
            className={this.state.mapClass}
          >
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker key={`current-location`} position={center} icon={curLocMark}>
              <Popup>
                {strings.youAreHere}
              </Popup>
            </Marker>
            {greenMarkers.map((position, idx) =>
              <Marker key={`marker-${idx}`} position={position[0]} icon={greenIcon}>
                <Popup
                  onOpen={() => this.OpenRestaurantInfo(position)}
                  onClose={this.CloseRestaurantInfo}
                  className="HiddenPopUp"/>
              </Marker>
            )}
            {greyMarkers.map((position, idx) =>
              <Marker key={`marker-${idx}`} position={position[0]} icon={greyIcon}>
                <Popup
                  onOpen={() => this.OpenRestaurantInfo(position)}
                  onClose={this.CloseRestaurantInfo}
                  className="HiddenPopUp"/>
              </Marker>
            )}
            <Circle center={center}
                    radius={this.props.searchRadiusInKm}
                    color={'red'}
                    fillOpacity={0.05}/>
          </Map>
          {this.state.restaurantInfoOpen &&
            <MapSmallRestaurantInfo
              restaurantInfo={this.state.restaurantInfo}
              language={this.props.language}/>
          }
        </div>
    )
  }
}

export default CustomMap;
