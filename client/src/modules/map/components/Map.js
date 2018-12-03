import React from 'react';
import ReactLoading from 'react-loading';
import {
  Button,
} from 'reactstrap';
/* Map component import */
import MapComponent from "./CustomMap"
import '../../../styles/map.css';
import GoogleMap from "./GoogleMapsMap"
import Geocoder from 'react-native-geocoding';

/* Location imports */
import {geolocated} from 'react-geolocated';

/* Localization */
import LocalizedStrings from 'react-localization';

/* Filter Page */
import ModalFilterPage from './ModalFilterPage'

import Config from '../../../config.js'

class Map extends React.Component {
  /* Constructor of the map class. */
  constructor(props) {
    super(props);

    this.state = {
      filters:{
        radius:10000,
        minOverall : 0,
        minReliability : 0,
        minVariety : 0,
        minService : 0,
        pricing: 0,
        city:"test"
      },
      center:[60.168182,24.940886],
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
      greenMarkers: [],
      greyMarkers: [],
    }
    Geocoder.init(Config.google.API_KEY);
    this.GetRestaurantsMarkers = this.GetRestaurantsMarkers.bind(this);
		this.FiltersChanged = this.FiltersChanged.bind(this);
		this.AddGreenMarker = this.AddGreenMarker.bind(this);
		this.AddGreyMarker = this.AddGreyMarker.bind(this);
    this.SelectedRestaurantChanged = this.SelectedRestaurantChanged.bind(this);
    var restaurantData = this.GetRestaurantsMarkers();

    this.state = {
      filters:{
        radius:10000,
        minOverall : 0,
        minReliability : 0,
        minVariety : 0,
        minService : 0,
        pricing: 0,
        city:""
      },
      center:[60.168182,24.940886],
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
      restaurants: restaurantData.restaurants,

      searchLoc:[60.168182,24.940886],
      errors:{errorWhileGeocoding:false},
    }

  }

  SelectedRestaurantChanged(idx,color){
    var selected = {};
    var tempGreen = this.state.restaurants.green;
    var tempGrey = this.state.restaurants.grey;
    var curSelectedColor = this.state.restaurants.selectedColour;
    var newColor = "";
    if(color === "green"){
      if(this.state.restaurants.green.length === 1){
        selected = this.state.restaurants.green[0];
        tempGreen = [];
      }
      else{
        selected = this.state.restaurants.green[idx];
        var temp = [];
        for(var j = 0; j<tempGreen.length; ++j){
          if(j !== idx){
            temp.push(tempGreen[j]);
          }
        }
        tempGreen = temp;
      }
      newColor = "green";
    }
    if(color === "grey"){
      if(this.state.restaurants.grey.length === 1){
        selected = this.state.restaurants.grey[0];
        tempGrey = [];
      }
      else{
        selected = this.state.restaurants.grey[idx];
        var temp = [];
        for(var j = 0; j<tempGrey.length; ++j){
          if(j !== idx){
            temp.push(tempGrey[j]);
          }
        }
        tempGrey = temp;
      }
      newColor = "grey";
    }
    if(curSelectedColor === "green"){
      if(this.state.restaurants.green === undefined || this.state.restaurants.green.length === 0){
        tempGreen = [this.state.restaurants.selected[0]]
      }
      else{
        tempGreen.push(this.state.restaurants.selected[0]);
      }
    }
    if(curSelectedColor === "grey"){
      if(this.state.restaurants.grey === undefined || this.state.restaurants.grey.length === 0){
        tempGrey = [this.state.restaurants.selected[0]]
      }
      else{
        tempGrey.push(this.state.restaurants.selected[0]);
      }
    }
    console.log(tempGrey)
    console.log(tempGreen)
    this.setState({
      center:selected.position,
      restaurants:{
        green: tempGreen,
        grey: tempGrey,
        selected: [selected],
        selectedColour: newColor,
      }
    })
  }

  // method handles fetching restaurants marker data from database
	GetRestaurantsMarkers(){
    //TODO: Implement restaurant fetch based on filters.

		//Mock restaurants.
    let greenRestaurantData = [
      {
        id:0,
        name:"Eka",
        city:"Hervanta",
        postcode:"33990",
        address:"Ravintolan 1 osoite",
        overallRating:"2",
        serviceRating:"3",
        varietyRating:"3",
        reliabilityRating: "4",
        website: "www.eka.fi",
        email: "eka@eka.fi",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
        position:[61.454239,23.849175],
      },
      {
        id:1,
        name:"Toinen",
        city:"Hervanta",
        postcode:"33990",
        address:"Ravintolan 1 osoite",
        overallRating:"2",
        serviceRating:"3",
        varietyRating:"3",
        reliabilityRating: "4",
        website: "www.eka.fi",
        email: "eka@eka.fi",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
        position: [61.426239,23.854175]
      },
      {
        id:2,
        name:"Kolmas",
        city:"Hervanta",
        postcode:"33990",
        address:"Ravintolan 1 osoite",
        overallRating:"2",
        serviceRating:"3",
        varietyRating:"3",
        reliabilityRating: "4",
        website: "www.eka.fi",
        email: "eka@eka.fi",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
        position: [61.445239,23.839175],
      },
      {
        id:3,
        name:"Neljäs",
        city:"Hervanta",
        postcode:"33990",
        address:"Ravintolan 1 osoite",
        overallRating:"2",
        serviceRating:"3",
        varietyRating:"3",
        reliabilityRating: "4",
        website: "www.eka.fi",
        email: "eka@eka.fi",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
        position: [61.487239,23.808175],
      }
    ]

    let greyRestaurantData = [
      {
        id:4,
        name:"Harmaa",
        city:"Hervanta",
        postcode:"33990",
        address:"Ravintolan 1 osoite",
        overallRating:"2",
        serviceRating:"3",
        varietyRating:"3",
        reliabilityRating: "4",
        website: "www.eka.fi",
        email: "eka@eka.fi",
        openMon:"9:00-15:00",
        openTue:"9:00-15:00",
        openWed:"9:00-15:00",
        openThu:"9:00-13:00",
        openFri:"9:00-16:00",
        openSat:"8:00-17:00",
        openSun:"10:00-18:00",
        position:[61.457239,23.848175],
      }]

    let newMarkers = {
      restaurants:{
        green:greenRestaurantData,
        grey:greyRestaurantData,
        selected:[],
        selectedColour:"",
      }
    }
    return newMarkers

    //Basic search portion
    var url = 'http://localhost:3000/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                + '&minOverallRating=' + this.state.filters.minOverall
                + '&minReliabilityRating=' + this.state.filters.minReliability
                + '&minVarietyRating=' + this.state.filters.minService
                + '&minServiceAndQualityRating=' + this.state.filters.minVariety;
    this.setState({loading:true})
    return fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Sending results");
          console.log(result);
          //Send data via props
          //Mock restaurant green markers.
          var newMarkers = {}
          let markers = [
            [[61.457239,23.848175],[1]],
            [[61.426239,23.854175],[2]],
            [[61.445239,23.839175],[3]],
            [[61.487239,23.808175],[4]],
            [[61.459239,23.918175],[5]],
            [[61.476239,23.768175],[6]],
            [[61.492239,23.798175],[7]]];
          let greyMarks = []
          if(markers.count <= 10){
            //Mock restaurant grey markers.
            greyMarks = [
              [[61.463871,23.829619],[8]],
              [[61.463999,23.830000],[9]],
              [[61.467252,23.851854],[10]]];
          }
          this.setState({loading:false,greyMarkers: greyMarks,greenMarkers:markers})
          newMarkers = {greyMarkers: greyMarks,greenMarkers:markers}
          return newMarkers
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("DEBUG: ComponentsDidMount error");
          console.log(error);
        }
      )
	}

  // Method handles filter change
	FiltersChanged(
    newRadius,
    newMinOverall,
    newMinReliability,
    newMinVariety,
    newMinService,
    newMinPricing,
    newCity,
    useUserLocation,
  )
  {
		this.setState({
      filters:{
        radius:newRadius,
        minOverall : newMinOverall,
        minReliability : newMinReliability,
        minVariety : newMinVariety,
        minService : newMinService,
        pricing: newMinPricing,
        city: newCity,
      }
    });
    if(useUserLocation){
      this.setState({
        searchLoc:[this.props.coords.latitude,this.props.coords.longitude],
        errors:{errorWhileGeocoding:false}
      });
      this.GetRestaurantsMarkers();
    }
    else{
      Geocoder.from(newCity)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        this.setState({searchLoc:location,errors:{errorWhileGeocoding:false}});
        this.GetRestaurantsMarkers();
      })
      .catch(error => {
        this.setState({errors:{errorWhileGeocoding:true}})
        console.warn(error)
      });
    }
	}

	//Method adds new green marker to map.
  AddGreenMarker(position){
    var markers = this.state.greenMarkers
    markers.push(position)
    this.setState({greenMarkers:markers})
  }

	//Method adds new grey marker to map.
  AddGreyMarker(position){
    var markers = this.state.greyMarkers
    markers.push(position)
    this.setState({greyMarkers:markers})
  }

  render() {
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        errorWhileGeocoding:"Error, your search location couldn't find!",
        Ok:"OK",
      },
      fi: {
        errorWhileGeocoding:"Virhe, syöttämääsi paikkaa ei löytynyt!",
        Ok:"OK",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    return(
      !this.props.isGeolocationAvailable? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
      ?
      <div className="mapPage">
        <div id="map" >
					<ModalFilterPage
            filters={this.state.filters}
						FiltersChanged={this.FiltersChanged}
						language={this.props.match.params.language}
            geolocationEnabled={false}/>
          {this.state.loading &&
            <ReactLoading
              type={'spokes'}
              color={'#2196F3'}
              className="loadingSpinner-map"
            />
          }
          <MapComponent
						language={this.props.match.params.language}
          	latitude={this.state.center[0]}
						longitude={this.state.center[1]}
          	searchRadiusInKm={this.state.filters.radius}
            selectedRestaurantChanged = {this.SelectedRestaurantChanged}
            center={this.state.center}
            restaurants={this.state.restaurants}
          />
        </div>
      </div>
      :this.props.coords
      ?<div id="map" >
			  <ModalFilterPage
          filters={this.state.filters}
					FiltersChanged={this.FiltersChanged}
					language={this.props.match.params.language}
          geolocationEnabled={true}
        />
        {this.state.loading &&
          <ReactLoading
            type={'spokes'}
            color={'#2196F3'}
            className="loadingSpinner-map"
          />
        }
        {this.state.errors.errorWhileGeocoding &&
          <div className="errorBox">
            <div className="errorText">
              {strings.errorWhileGeocoding}
            </div>
            <div className="error-button-box">
              <Button
                className="ErrorBoxBtn"
                onClick={() => this.setState({errors:{errorWhileGeocoding:false}})}
                >
                {strings.Ok}
              </Button>
            </div>
          </div>
        }
        <MapComponent
					language={this.props.match.params.language}
	        latitude={this.state.searchLoc[0]}
					longitude={this.state.searchLoc[1]}
	        searchRadiusInKm={this.state.filters.radius}
          center={this.state.center}
          restaurants={this.state.restaurants}
          selectedRestaurantChanged = {this.SelectedRestaurantChanged}
				/>
      </div>
      : <div>Getting the location data&hellip; </div>
    )
  }
}

export default geolocated(
	{
		positionOptions:{enableHighAccuracy: false,},
		userDescisionTimeout:5000,
	})(Map);
