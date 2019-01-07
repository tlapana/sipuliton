import React from 'react';
/* Map imports */
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet'
import L from 'leaflet';
import '../../../styles/map.css';

/* Localization */
import LocalizedStrings from 'react-localization';

/* Restaurant info */
import MapSmallRestaurantInfo from './MapSmallRestaurantInfo'

class CustomMap extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.state = {
      zoom: 13,
      isSearching:false,
    }

  }

  //Fetches restaurant info and opens restaurant info box
  OpenRestaurantInfo(position,color,idx){
    this.props.selectedRestaurantChanged(idx,color);
    this.render();
  }

  //Closes restaurant info box

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

     // icon for the search result
     const yellowIcon = L.icon({
          iconUrl: require('../../../resources/YellowPin.png'),
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
        searching: "Getting restaurant information",
        restaurantNotFound: "Restaurant details not found.",
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
        youAreHere: "Olet tässä!",
        searching: "Haetaan ravintolan tietoja.",
        restaurantNotFound: "Ravintolan tietoja ei löytynyt.",
        backToMap: "Takaisin karttaan"
      }
    });
    strings.setLanguage(this.props.language);

    /* map center init */
    var center = this.props.center
    if(this.props.latitude !== undefined
      && this.props.longitude !== undefined
      && this.props.center[0] === 60.168182
      && this.props.center[1] === 24.940886)
    {
      center = [this.props.latitude,this.props.longitude]
    }

    /* markers init */
    var greyMarkers = [];
    var greenMarkers = [];
    var selectedMarker = [];
    if(this.props.restaurants !== undefined &&
      this.props.restaurants.grey !== undefined &&
      this.props.restaurants.grey[0] !== undefined){
      greyMarkers = this.props.restaurants.grey;
    }
    if(this.props.restaurants !== undefined &&
      this.props.restaurants.green !== undefined &&
      this.props.restaurants.green[0] !== undefined){
      greenMarkers = this.props.restaurants.green;
    }
    if(this.props.restaurants !== undefined &&
      this.props.restaurants.selected !== undefined &&
      this.props.restaurants.selected[0] !== undefined){
      selectedMarker = this.props.restaurants.selected;
    }

    const rootClassName = this.props.loading === true ? "map-loading" : "";
    return(
        <div className={rootClassName}>
          <Map
            center={center}
            zoom={this.state.zoom}
            className="full"
          >
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {this.props.showCurrentLocationMarker &&
              <Marker key={`current-location`} position={[this.props.latitude,this.props.longitude]} icon={curLocMark}>
                <Popup>
                  {strings.youAreHere}
                </Popup>
              </Marker>
            }
            {selectedMarker.map((data, idx) =>
              <Marker key={`marker-${idx}`} position={data.position} icon={yellowIcon}>
                <Popup
                  onOpen={() => this.OpenRestaurantInfo(data,"",idx)}
                  className="HiddenPopUp"/>
              </Marker>
            )}
            {greenMarkers.map((data, idx) =>
              <Marker key={`marker-${idx}`} position={data.position} icon={greenIcon}>
                <Popup
                  onOpen={() => this.OpenRestaurantInfo(data,"green",idx)}
                  className="HiddenPopUp"/>
              </Marker>
            )}
            {greyMarkers.map((data, idx) =>
              <Marker key={`marker-${idx}`} position={data.position} icon={greyIcon}>
                <Popup
                  onOpen={() => this.OpenRestaurantInfo(data,"grey",idx)}
                  className="HiddenPopUp"/>
              </Marker>
            )}
            <Circle center={[this.props.latitude,this.props.longitude]}
                    radius={this.props.searchRadiusInKm}
                    color={'red'}
                    fillOpacity={0.05}/>

          </Map>
            <div className="restaurants-list">
                {selectedMarker.map((data, idx) =>
                  <div key={`info-${idx}`}
                    className="restaurant-info-block"
                  >
                    <MapSmallRestaurantInfo
                      restaurantInfo={data}
                      language={this.props.language}
                      pinColor={"yellow"}/>
                  </div>
                )}
                {greenMarkers.map((data, idx) =>
                  <div key={`info-${idx}`}
                    className="restaurant-info-block"
                    onClick={() => this.OpenRestaurantInfo(data,"green",idx)}
                  >
                    <MapSmallRestaurantInfo
                      restaurantInfo={data}
                      language={this.props.language}
                      pinColor={"green"}/>
                  </div>
                )}
                {greyMarkers.map((data, idx) =>
                  <div key={`info-${idx}`}
                    className="restaurant-info-block"
                    onClick={() => this.OpenRestaurantInfo(data,"grey",idx)}
                  >
                    <MapSmallRestaurantInfo
                      restaurantInfo={data}
                      language={this.props.language}
                      pinColor={"grey"}/>
                  </div>
                )}
            </div>
        </div>
    )
  }
}

export default CustomMap;
