import React from 'react';
import ReactLoading from 'react-loading';

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
      },
      greenMarkers: [],
      greyMarkers: [],
    }

    this.GetRestaurantsMarkers = this.GetRestaurantsMarkers.bind(this);
		this.FiltersChanged = this.FiltersChanged.bind(this);
		this.AddGreenMarker = this.AddGreenMarker.bind(this);
		this.AddGreyMarker = this.AddGreyMarker.bind(this);
    this.CenterChanged = this.CenterChanged.bind(this);

    // Get restaurants
    //var markers = this.GetRestaurantsMarkers();

  }

  // method handles map center change
  CenterChanged(newCenter){
    this.setState({center:newCenter})
  }

  // method handles fetching restaurants marker data from database
	GetRestaurantsMarkers(){
    //TODO: Implement restaurant fetch based on filters.

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
            greenMarkersData={this.state.greenMarkers}
            greyMarkersData={this.state.greyMarkers}
            centerChanged={this.CenterChanged}
            center={this.state.center}
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
        <MapComponent
					language={this.props.match.params.language}
	        latitude={this.props.coords.latitude}
					longitude={this.props.coords.longitude}
	        searchRadiusInKm={this.state.filters.radius}
					greenMarkersData={this.state.greenMarkers}
					greyMarkersData={this.state.greyMarkers}
          centerChanged={this.CenterChanged}
          center={this.state.center}
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
