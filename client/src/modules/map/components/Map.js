import React from 'react';

/* Map component import */
import MapComponent from "./CustomMap"
import '../../../styles/map.css';
import GoogleMap from "./GoogleMapsMap"
/* Location imports */
import {geolocated} from 'react-geolocated';

/* Localization */
import LocalizedStrings from 'react-localization';

/* Filter Page */
import ModalFilterPage from './ModalFilterPage'

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
      }
    }

    this.GetRestaurantsMarkers = this.GetRestaurantsMarkers.bind(this);
		this.FiltersChanged = this.FiltersChanged.bind(this);
		this.AddGreenMarker = this.AddGreenMarker.bind(this);
		this.AddGreyMarker = this.AddGreyMarker.bind(this);
    this.CenterChanged = this.CenterChanged.bind(this);

    var markers = this.GetRestaurantsMarkers();

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
			greenMarkers: markers.greenMarkers,
			greyMarkers: markers.greyMarkers,
      restaurants: markers.restaurants,
    }

  }

  CenterChanged(newCenter){
    this.setState({center:newCenter})
  }

	GetRestaurantsMarkers(){
    //TODO: Implement restaurant fetch based on filters.

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

    let restaurantData = [
      {
        id:0,
        name:"First",
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
      },
      {
        id:0,
        name:"First",
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
      },
      {
        id:0,
        name:"First",
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
      },
      {
        id:0,
        name:"First",
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
      }
    ]

    newMarkers = {
      greyMarkers: greyMarks,
      greenMarkers:markers,
      restaurants:restaurantData
    }
    return newMarkers
	}

	FiltersChanged(
    newRadius,
    newMinOverall,
    newMinReliability,
    newMinVariety,
    newMinService,
    newMinPricing,
    newCity
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
    this.GetRestaurantsMarkers();
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
          <MapComponent
						language={this.props.match.params.language}
          	latitude={this.state.center[0]}
						longitude={this.state.center[1]}
          	searchRadiusInKm={this.state.filters.radius}
            greenMarkersData={this.state.greenMarkers}
            greyMarkersData={this.state.greyMarkers}
            centerChanged={this.CenterChanged}
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
        <MapComponent
					language={this.props.match.params.language}
	        latitude={this.props.coords.latitude}
					longitude={this.props.coords.longitude}
	        searchRadiusInKm={this.state.filters.radius}
					greenMarkersData={this.state.greenMarkers}
					greyMarkersData={this.state.greyMarkers}
          centerChanged={this.CenterChanged}
          center={this.state.center}
          restaurants={this.state.restaurants}
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
