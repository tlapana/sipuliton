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
      radius:10000,
      center:[60.168182,24.940886],
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
			greenMarkers: [      [[61.457239,23.848175],[1]],
			      [[61.426239,23.854175],[2]],
			      [[61.445239,23.839175],[3]],
			      [[61.487239,23.808175],[4]],
			      [[61.459239,23.918175],[5]],
			      [[61.476239,23.768175],[6]],
			      [[61.492239,23.798175],[7]]],
			greyMarkers: [	      [[61.463871,23.829619],[8]],
				      [[61.463999,23.830000],[9]],
				      [[61.467252,23.851854],[10]]],
    }
		this.GetRestaurants = this.GetRestaurants.bind(this);
		this.RadiusChanged = this.RadiusChanged.bind(this);
		this.AddGreenMarker = this.AddGreenMarker.bind(this);
		this.AddGreyMarker = this.AddGreyMarker.bind(this);

		this.GetRestaurants();
  }

	GetRestaurants(){
		console.log("kutsuttu");
		//Mock restaurant green markers.
    let markers = [
      [[61.457239,23.848175],[1]],
      [[61.426239,23.854175],[2]],
      [[61.445239,23.839175],[3]],
      [[61.487239,23.808175],[4]],
      [[61.459239,23.918175],[5]],
      [[61.476239,23.768175],[6]],
      [[61.492239,23.798175],[7]]];
		this.setState({greenMarkers: markers});
		if(markers.count <= 10){
			//Mock restaurant grey markers.
	    let greyMarks = [
	      [[61.463871,23.829619],[8]],
	      [[61.463999,23.830000],[9]],
	      [[61.467252,23.851854],[10]]];
			this.setState({greyMarkers: greyMarks});
		}
		console.log(this.state.greenMarkers);
	}

	RadiusChanged(newRadius){
		this.setState({radius:newRadius})
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
      ? <div id="map" >
					<ModalFilterPage
						ChangeRadius={this.RadiusChanged}
						language={this.props.match.params.language}/>
          <MapComponent
						language={this.props.match.params.language}
          	latitude={this.state.center[0]}
						longitude={this.state.center[1]}
          	searchRadiusInKm={this.state.radius}/>
        </div>
      :this.props.coords
      ?<div id="map" >
			  <ModalFilterPage
					ChangeRadius={this.RadiusChanged}
					language={this.props.match.params.language}/>
        <MapComponent
					language={this.props.match.params.language}
	        latitude={this.props.coords.latitude}
					longitude={this.props.coords.longitude}
	        searchRadiusInKm={this.state.radius}
					greenMarkersData={this.state.greenMarkers}
					greyMarkersData={this.state.greyMarkers}
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
