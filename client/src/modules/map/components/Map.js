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

    var overallRating = 0;
    var minRel = 0;
    var minVariety = 0;
    var minService = 0;
    var minPricing = 0;
    var diets = [];
    var city = "";
    var searchRadius = 10000;
    var showFilterBox = true;
    var longitude = 24.940886;
    var latitude = 60.168182;
    var loading = false;
    var showCurrentLocationMarker = true;
    if(this.props.location.search !== undefined
      && this.props.location.search !== ""
      && this.props.location.search.includes("?")
    ){
      var variables = this.props.location.search.replace("?","");
      var varArray = variables.split("&");
      for(var i = 0; i<varArray.length; i++){
        var el = varArray[i];
        var varValPair = el.split("=");
        if(varValPair[0] === "minOverallRating"){
          overallRating = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "minReliabilityRating"){
          minRel = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "minVarietyRating"){
          minVariety = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "minServiceAndQualityRating"){
          minService = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "searchRadius"){
          searchRadius = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "minServiceAndQualityRating"){
          minService = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "minPricing"){
          minPricing = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "city"){
          city = varValPair[1];
        }
        if(varValPair[0] === "searchLongitude"){
          longitude = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "searchLatitude"){
          latitude = parseInt(varValPair[1]);
        }
        if(varValPair[0] === "searchDiets"){
          diets = varValPair[1];
        }
      }
      showFilterBox = false;
      loading = true;
      showCurrentLocationMarker = false;
    }

    this.state = {
      filters:{
        radius:searchRadius,
        minOverall : overallRating,
        minReliability : minRel,
        minVariety : minVariety,
        minService : minService,
        pricing: minPricing,
        city:city,
        diets:diets,
      },
      showFilterBox: showFilterBox,
      center:[latitude,longitude],
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
      searchLoc:[latitude,longitude],
      errors:{
        errorWhileGeocoding:false,
        errorWhileSearching:false,
        errorRestaurantsNotFound:false,
      },
      showCurrentLocationMarker:showCurrentLocationMarker,
      loading:loading,
      restaurants:{
        green:[],
        green:[],
        selected:[],
        selectedColour:"",
      }
    };
    console.log(this.state);
    Geocoder.init(Config.google.API_KEY);
    this.compare = this.compare.bind(this);
    this.GetRestaurantsMarkers = this.GetRestaurantsMarkers.bind(this);
		this.FiltersChanged = this.FiltersChanged.bind(this);
    this.SelectedRestaurantChanged = this.SelectedRestaurantChanged.bind(this);
    this.GetMockData = this.GetMockData.bind(this);
    if(this.props.location.search !== undefined
      && this.props.location.search !== ""
      && this.props.location.search.includes("?")
    ){
      this.GetRestaurantsMarkers("green");
    }
  }

  compare(a,b){
    var distToA = Math.sqrt(Math.pow(a.position[0] - this.state.center[0])+Math.pow(a.position[1]-this.state.center[1]))
    var distToB = Math.sqrt(Math.pow(b.position[0] - this.state.center[0])+Math.pow(b.position[1]-this.state.center[1]))
    if( distToA < distToB){
      return -1;
    }
    if(distToA > distToB){
      return 1;
    }
    return 0;
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
    if(tempGreen !== undefined && tempGreen.length !== 0){
      tempGreen = tempGreen.sort(this.compare);
    }
    if(tempGrey !== undefined && tempGrey.length !== 0){
      tempGrey = tempGrey.sort(this.compare);
    }
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

  GetMockData(){
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
        pricingRating:"3",
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
        pricingRating:"1",
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
        pricingRating:"2",
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
        pricingRating:"2",
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
        pricingRating:"2",
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

    greenRestaurantData = greenRestaurantData.sort(this.compare);
    greyRestaurantData = greyRestaurantData.sort(this.compare);

    this.setState(
      {
        loading:false,
        restaurants:{
          green:greenRestaurantData,
          grey:greyRestaurantData,
          selected:[],
          selectedColour:"",
        }
      }
    )

  }

  // method handles fetching restaurants marker data from database
	GetRestaurantsMarkers(markColor){
    console.log("Getting: "+markColor)
    console.log(this.state.searchLoc)
    //Basic search portion
    var url = 'http://localhost:3000/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                + '&minOverallRating=' + this.state.filters.minOverall
                + '&minReliabilityRating=' + this.state.filters.minReliability
                + '&minVarietyRating=' + this.state.filters.minService
                + '&minServiceAndQualityRating=' + this.state.filters.minVariety
                + '&maxDistance=' + this.state.filters.radius
                + '&currentLatitude=' + this.state.searchLoc[0]
                + '&currentLongitude=' + this.state.searchLoc[1];

    if(markColor === "grey"){
      url = 'http://localhost:3000/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                  + '&minOverallRating=0'
                  + '&minReliabilityRating=0'
                  + '&minVarietyRating=0'
                  + '&minServiceAndQualityRating=0'
                  + '&maxDistance=' + this.state.filters.radius
                  + '&currentLatitude=' + this.state.searchLoc[0]
                  + '&currentLongitude=' + this.state.searchLoc[1];
    }

    this.setState({loading:true})
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Sending results");
          console.log(result);
          //Send data via props
          //Mock restaurant green markers.
          let markers = [];
          for(var i = 0; i<result.restaurants.length; ++i){
            var res = result.restaurants[i];
            /*Check that opening hours are not null */
            var resObj = {
              id:res.restaurant_id,
              name:res.restaurant_name,
              city:res.city_name,
              postcode:"33990",
              address:res.street_address,
              overallRating:res.rating_overall,
              serviceRating:res.rating_service_and_quality,
              varietyRating:res.rating_variety,
              reliabilityRating: res.rating_reliability,
              pricingRating: res.pricing,
              website: res.website,
              email: res.email,
              openMon:res.opens_mon+"-"+res.closes_mon,
              openTue:res.opens_tue+"-"+res.closes_tue,
              openWed:res.opens_wed+"-"+res.closes_wed,
              openThu:res.opens_thu+"-"+res.closes_thu,
              openFri:res.opens_fri+"-"+res.closes_fri,
              openSat:res.opens_sat+"-"+res.closes_sat,
              openSun:res.opens_sun+"-"+res.closes_sun,
              position: [res.latitude,res.longitude],
            }
            markers.push(resObj);
          }
          if(markColor === "grey"){
            var greenMarks = this.state.restaurants.green;
            var alreadyFoundRestaurants = [];
            for(var i = 0; i<greenMarks.length; ++i){
              alreadyFoundRestaurants.push(greenMarks[i].id);
            }
            markers = markers
                 .filter(x => !alreadyFoundRestaurants.includes(x.id));
            if(markers === undefined){
              markers = [];
            }
            if(markers.length >= 10){
              var number = 10-this.state.restaurants.green.length;
              markers = markers.slice(0,number);
            }
          }

          if((markers.length === 0 || markers.length === undefined) &&
            markColor === "grey" &&
            this.state.restaurants.green.length === 0
          )
          {
            this.setState({
              loading:false,
              errors:{
                errorRestaurantsNotFound:true
              }
            })
            return;
          }

          if(markColor === "grey"){
            this.setState(
              {
                loading:false,
                restaurants:{
                  grey:markers,
                  green:this.state.restaurants.green,
                  selected:[],
                  selectedColour:"",
                }
              }
            )
          }
          else{
            this.setState(
              {
                loading:false,
                restaurants:{
                  green:markers,
                  grey:[],
                  selected:[],
                  selectedColour:"",
                }
              }
            )
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("DEBUG: ComponentsDidMount error");
          console.log(error);
          this.setState({loading:false,errors:{errorWhileSearching:true},});
        }
      )
      .then(
        () => {
          if(markColor === "green"){
            if(this.state.restaurants.green.length < 10){
              this.GetRestaurantsMarkers("grey");
            }
          }
        }
      );
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
    newDiets,
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
        diets:newDiets,
      }
    });
    if(useUserLocation){
      this.setState({
        searchLoc:[this.props.coords.latitude,this.props.coords.longitude],
        showCurrentLocationMarker:true,
        errors:{errorWhileGeocoding:false}
      },() => this.GetRestaurantsMarkers("green"));

    }
    else{
      Geocoder.from(newCity)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        this.setState(
          {
            showCurrentLocationMarker:false,
            searchLoc:[location.lat,location.lng],
            errors:{errorWhileGeocoding:false}
          },() => this.GetRestaurantsMarkers("green")
        );
      })
      .catch(error => {
        this.setState({showCurrentLocationMarker:false,errors:{errorWhileGeocoding:true}})
        console.warn(error)
      });
    }
	}

  render() {
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        errorWhileGeocoding:"Error, your search location couldn't find!",
        Ok:"OK",
        errorWhileSearching:"Error while searching restaurant, try again!",
        errorRestaurantsNotFound:"Restaurants not found, change filters."
      },
      fi: {
        errorWhileGeocoding:"Virhe, syöttämääsi paikkaa ei löytynyt!",
        Ok:"OK",
        errorWhileSearching:"Virhe etsittäessä ravintoloita, yritä uudelleen!",
        errorRestaurantsNotFound:"Ravintoloita ei löytynyt, muuta rajaus ehtoja.",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    return(
      <div>
      {this.state.loading &&
        <div className="loading-container">
          <ReactLoading
            type={'spinningBubbles'}
            className="loadingSpinner loadingSpinner-map"
          />
        </div>
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
      {this.state.errors.errorWhileSearching &&
        <div className="errorBox">
          <div className="errorText">
            {strings.errorWhileSearching}
          </div>
          <div className="error-button-box">
            <Button
              className="ErrorBoxBtn"
              onClick={() => this.setState({errors:{errorWhileSearching:false}})}
              >
              {strings.Ok}
            </Button>
          </div>
        </div>
      }
      {this.state.errors.errorRestaurantsNotFound &&
        <div className="errorBox">
          <div className="errorText">
            {strings.errorRestaurantsNotFound}
          </div>
          <div className="error-button-box">
            <Button
              className="ErrorBoxBtn"
              onClick={() => this.setState({errors:{errorRestaurantsNotFound:false}})}
              >
              {strings.Ok}
            </Button>
          </div>
        </div>
      }
      {
        !this.props.isGeolocationAvailable? <div>Your browser does not support Geolocation</div>
        : !this.props.isGeolocationEnabled
        ?
        <div className="mapPage">
          <div id="map" >
  					<ModalFilterPage
              filters={this.state.filters}
  						FiltersChanged={this.FiltersChanged}
  						language={this.props.match.params.language}
              geolocationEnabled={false}
              showFilterBoxAtStart={this.state.showFilterBox}/>
            {this.state.loading &&
              <div className="loading-container">
                <ReactLoading
                  type={'spinningBubbles'}
                  className="loadingSpinner loadingSpinner-map"
                />
              </div>
            }
            <MapComponent
  						language={this.props.match.params.language}
            	latitude={this.state.center[0]}
  						longitude={this.state.center[1]}
            	searchRadiusInKm={this.state.filters.radius}
              selectedRestaurantChanged = {this.SelectedRestaurantChanged}
              center={this.state.center}
              restaurants={this.state.restaurants}
              showCurrentLocationMarker={this.state.showCurrentLocationMarker}
              loading={this.state.loading}
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
            showFilterBoxAtStart={this.state.showFilterBox}
          />
          <MapComponent
  					language={this.props.match.params.language}
  	        latitude={this.state.searchLoc[0]}
  					longitude={this.state.searchLoc[1]}
  	        searchRadiusInKm={this.state.filters.radius}
            center={this.state.center}
            restaurants={this.state.restaurants}
            selectedRestaurantChanged = {this.SelectedRestaurantChanged}
            showCurrentLocationMarker={this.state.showCurrentLocationMarker}
            loading={this.state.loading}
  				/>
        </div>
        : <div>Getting the location data&hellip; </div>
      }
      </div>
    )
  }
}

export default geolocated(
	{
		positionOptions:{enableHighAccuracy: false,},
		userDescisionTimeout:5000,
	})(Map);
