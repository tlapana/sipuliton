
import React from 'react';
import ReactLoading from 'react-loading';
import {Button,} from 'reactstrap';
/* Map component import */
import MapComponent from "./CustomMap"
import '../../../styles/map.css';
import Geocoder from 'react-native-geocoding';

/* Location imports */
import {geolocated} from 'react-geolocated';

/* Localization */
import LocalizedStrings from 'react-localization';

/* Filter Page */
import ModalFilterPage from './ModalFilterPage';

/* Configurations */
import Config from '../../../config.js';

const MapApi = require('./MapGlobalFunctions');

class Map extends React.Component {
  /* Constructor of the map class. */
  constructor(props) {
    super(props);

    //Initializes basic state.
    var filters = {
      overallRating:0,
      minRel:0,
      minVariety:0,
      searchRadius:10000,
      minService:0,
      minPricing:0,
      city:"",
      longitude:24.940886,
      latitude:60.168182,
      diets:[],
    }
    //Geocoder initialization. This is needed for converting address to location.
    Geocoder.init(Config.google.API_KEY);

    var showFilterBox = true;
    var loading = false;
    var showCurrentLocationMarker = true;

    //Checks if parameters is set to url and if it set parse them.
    if(this.props.location.search !== undefined
      && this.props.location.search !== ""
      && this.props.location.search.includes("?")
    ){
      //Parse parameters
      filters = MapApi.parseMapUrlParametersToFilters(this.props.location.search);
      showFilterBox = false;
      loading = true;
      showCurrentLocationMarker = false;
    }
    //console.log(filters);
    //Initialize new state vased on new filters.
    this.state = {
      filters:{
        radius:filters.searchRadius,
        minOverall : filters.overallRating,
        minReliability : filters.minRel,
        minVariety : filters.minVariety,
        minService : filters.minService,
        pricing: filters.minPricing,
        city:filters.city,
        diets:filters.diets,
      },
      cityPassed:!filters.useUserLocation,
      showFilterBox: showFilterBox,
      center:[filters.latitude,filters.longitude],
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
      searchLoc:[filters.latitude,filters.longitude],
      errors:{
        errorWhileGeocoding:false,
        errorWhileSearching:false,
        errorRestaurantsNotFound:false,
      },
      showCurrentLocationMarker:showCurrentLocationMarker,
      loading:loading,
      restaurants:{
        green:[],
        grey:[],
        selected:[],
        selectedColour:"",
      }
    };

    //console.log(this.state);

    //Function bindings.
    this.GetRestaurantsMarkers = this.GetRestaurantsMarkers.bind(this);
		this.FiltersChanged = this.FiltersChanged.bind(this);
    this.SelectedRestaurantChanged = this.SelectedRestaurantChanged.bind(this);
    this.FetchRestaurants = this.FetchRestaurants.bind(this);

    //Fetch restaurant markers based on new filters if search parameters where inserted.
    if(this.props.location.search !== undefined
      && this.props.location.search !== ""
      && this.props.location.search.includes("?")
    ){
      this.GetRestaurantsMarkers("green");
    }
  }

  //Method changes the selected restaurant. Method takes as a parameter
  //restaurant id and color.
  SelectedRestaurantChanged(idx,color){
    var selected = {};
    var tempGreen = this.state.restaurants.green;
    var tempGrey = this.state.restaurants.grey;
    var curSelectedColor = this.state.restaurants.selectedColour;
    var newColor = "";
    if(color === "green"){
      //Selects green restaurant.
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
      //Selects grey restaurant
      if(this.state.restaurants.grey.length === 1){
        selected = this.state.restaurants.grey[0];
        tempGrey = [];
      }
      else{
        selected = this.state.restaurants.grey[idx];
        var tempList = [];
        for(var u = 0; u<tempGrey.length; ++u){
          if(u !== idx){
            tempList.push(tempGrey[u]);
          }
        }
        tempGrey = tempList;
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

    //Set new map center and sort restaurant lists by the distance.
    if(tempGreen !== undefined && tempGreen.length !== 0){
      MapApi.setNewCenter(this.state.center);
      tempGreen = tempGreen.sort(MapApi.sortByDistanceToCenter());
    }
    if(tempGrey !== undefined && tempGrey.length !== 0){
      MapApi.setNewCenter(this.state.center);
      tempGrey = tempGrey.sort(MapApi.sortByDistanceToCenter());
    }

    //Initialize new restaurant marker data.
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

  // Method handles fetching restaurants marker data from database.
  // Takes marker color as a parameter which will be fetched.
	GetRestaurantsMarkers(markColor){
    //Printing for the debugging.
    //console.log("Getting: "+markColor)
    //console.log(this.state.searchLoc)

    var dietParam = "&globalDietId=[]";
    if(this.state.filters.diets != undefined && this.state.filters.diets.length>0)
    {
      var searchDiets = [];
      for(var i = 0; i<this.state.filters.diets.length; ++i)
      {
        searchDiets.push(this.state.filters.diets[i].value);
      }
      var diet_ids = searchDiets;
      var diet_array_string = "[";
      for(var i = 0; i<diet_ids.length-1; ++i)
      {
        if(diet_ids[i] !== undefined)
        {
          diet_array_string = diet_array_string+diet_ids[i]+',';
        }
      }
      diet_array_string = diet_array_string+diet_ids[diet_ids.length-1]+']';
      dietParam = '&globalDietId='+diet_array_string;
    }
    //console.log(dietParam);

    if(this.state.cityPassed)
    {
      // Change city name to location.
      Geocoder.from(this.state.filters.city)
      .then(json => {
        //New location.
        var location = json.results[0].geometry.location;
        //Console print for debugging.
        //console.log(location);
        //Basic search portion for the green markers.
        var url = Config.backendAPIPaths.BASE+'/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                    + '&minOverallRating=' + this.state.filters.minOverall
                    + '&minReliabilityRating=' + this.state.filters.minReliability
                    + '&minVarietyRating=' + this.state.filters.minService
                    + '&minServiceAndQualityRating=' + this.state.filters.minVariety
                    + '&maxDistance=' + this.state.filters.radius
                    + '&currentLatitude=' + location.lat
                    + '&currentLongitude=' + location.lng
                    + dietParam;
        //console.log(url);
        if(markColor === "grey"){
          //Basic search portion for the grey markers. Here all ratings are set to 0 to find more restaurants.
          url = Config.backendAPIPaths.BASE+'/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                      + '&minOverallRating=0'
                      + '&minReliabilityRating=0'
                      + '&minVarietyRating=0'
                      + '&minServiceAndQualityRating=0'
                      + '&maxDistance=' + this.state.filters.radius
                      + '&currentLatitude=' + location.lat
                      + '&currentLongitude=' + location.lng
                      + dietParam;
        }
        //console.log(url);
        this.setState({
          center:[location.lat,location.lng],
          searchLoc:[location.lat,location.lng],
          cityPassed:false,
        })
        this.FetchRestaurants(url,markColor);
      })
      .catch(error => {
        console.warn(error)
      });
    }
    else{
      //Basic search portion for the green markers.
      var url = Config.backendAPIPaths.BASE+'/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                  + '&minOverallRating=' + this.state.filters.minOverall
                  + '&minReliabilityRating=' + this.state.filters.minReliability
                  + '&minVarietyRating=' + this.state.filters.minService
                  + '&minServiceAndQualityRating=' + this.state.filters.minVariety
                  + '&maxDistance=' + this.state.filters.radius
                  + '&currentLatitude=' + this.state.searchLoc[0]
                  + '&currentLongitude=' + this.state.searchLoc[1]
                  + dietParam;
      //console.log(url);
      if(markColor === "grey"){
        //Basic search portion for the grey markers. Here all ratings are set to 0 to find more restaurants.
        url = Config.backendAPIPaths.BASE+'/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                    + '&minOverallRating=0'
                    + '&minReliabilityRating=0'
                    + '&minVarietyRating=0'
                    + '&minServiceAndQualityRating=0'
                    + '&maxDistance=' + this.state.filters.radius
                    + '&currentLatitude=' + this.state.searchLoc[0]
                    + '&currentLongitude=' + this.state.searchLoc[1]
                    + dietParam;
      }
      this.FetchRestaurants(url,markColor);
    }

    //Set map to loading state.
    this.setState({loading:true})

	}

  FetchRestaurants(url,markColor)
  {

        //Fetch marker data.
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              //Printings for the debugging.
              //console.log("Sending results");
              //console.log(result);

              //Parse fetched data using map global api.
              var markers = MapApi.parseRestaurantsData(result.restaurants);
              if(markColor === "grey"){
                //Selects most suitable grey markers.
                markers = MapApi.chooseGreyMarkers(this.state.restaurants.green,markers);
              }

              if((markers.length === 0 || markers.length === undefined) &&
                markColor === "grey" &&
                this.state.restaurants.green.length === 0
              )
              {
                //Here is not found any green and grey markers, so show no
                //restaurants found notification.

                this.setState({
                  loading:false,
                  errors:{
                    errorRestaurantsNotFound:true
                  }
                })
                return;
              }

              if(markColor === "grey"){
                // Set new center point to the map api.
                MapApi.setNewCenter(this.state.center);

                // Sort markers by distance.
                markers = markers.sort(MapApi.sortByDistanceToCenter());
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
                // Set new center point to the map api.
                MapApi.setNewCenter(this.state.center);
                // Sort markers by distance.
                markers = markers.sort(MapApi.sortByDistanceToCenter());
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
              //Check if the fetched markers were green.
              if(markColor === "green"){
                //Check if there was found under 10 restaurant
                if(this.state.restaurants.green.length < 10){
                  //Fetch more restaurants as a grey restaurant.
                  this.GetRestaurantsMarkers("grey");
                }
              }
            }
          );
  }

  // Method handles filter changes. Takes as a parameter new filters.
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
    //Init new filters.
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
    //Check if the user wants to use own location in search.
    if(useUserLocation){
      // Set users location as a search location. And after that fetch new markers.
      this.setState({
        searchLoc:[this.props.coords.latitude,this.props.coords.longitude],
        showCurrentLocationMarker:true,
        errors:{errorWhileGeocoding:false}
      },() => this.GetRestaurantsMarkers("green"));
    }
    else{
      // Change city name to location.
      Geocoder.from(newCity)
      .then(json => {
        //New location.
        var location = json.results[0].geometry.location;
        //Console print for debugging.
        //console.log(location);

        //init new location and fetch markers.
        this.setState(
          {
            showCurrentLocationMarker:false,
            searchLoc:[location.lat,location.lng],
            center:[location.lat,location.lng],
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
    if(this.props.isGeolocationEnabled && this.props.isGeolocationAvailable && this.props.isGeolocationEnabled && this.props.coords != null)
    {
      var useLocation = true;
    }
    else
    {
      var useLocation = false;
    }
    console.log();
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
        !useLocation?
        <div className="mapPage">
          <div id="map" >
            <div>
    					<ModalFilterPage
                filters={this.state.filters}
    						FiltersChanged={this.FiltersChanged}
    						language={this.props.match.params.language}
                geolocationEnabled={false}
                showFilterBoxAtStart={this.state.showFilterBox}/>
              {this.state.loading &&
                <div className="loading-container loading-modal-filter-page">
                  <ReactLoading
                    type={'spinningBubbles'}
                    className="loadingSpinner loadingSpinner-map"
                  />
                </div>
              }
            </div>
            <MapComponent
  						language={this.props.match.params.language}
            	latitude={this.state.searchLoc[0]}
  						longitude={this.state.searchLoc[1]}
            	searchRadiusInKm={this.state.filters.radius}
              selectedRestaurantChanged = {this.SelectedRestaurantChanged}
              center={this.state.center}
              restaurants={this.state.restaurants}
              showCurrentLocationMarker={this.state.showCurrentLocationMarker}
              loading={this.state.loading}
            />
          </div>
        </div>
        :<div id="map" >
  			  <ModalFilterPage
            filters={this.state.filters}
  					FiltersChanged={this.FiltersChanged}
  					language={this.props.match.params.language}
            geolocationEnabled={true}
            showFilterBoxAtStart={this.state.showFilterBox}
          />
          {this.state.loading &&
            <div className="loading-container loading-modal-filter-page">
              <ReactLoading
                type={'spinningBubbles'}
                className="loadingSpinner loadingSpinner-map"
              />
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
            showCurrentLocationMarker={this.state.showCurrentLocationMarker}
            loading={this.state.loading}
  				/>
        </div>
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
