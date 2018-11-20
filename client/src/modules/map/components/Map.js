import React from 'react';
import {
	Form,
  Label
} from 'reactstrap';

/* Map component import */
import MapComponent from "./CustomMap"
import '../../../styles/map.css';

/* Location imports */
import {geolocated} from 'react-geolocated';

/* Localization */
import LocalizedStrings from 'react-localization';

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
      }
    }
  }
  RadiusChanged = event =>{
    this.setState({radius:event.target.value})
    if(event.target.value === "2000"){
      this.setState({
        checkboxes:{
              first:true,
              second:false,
              third:false,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "5000"){
      this.setState({
        checkboxes:{
              first:false,
              second:true,
              third:false,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "10000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:true,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "15000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:true,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "25000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:false,
              fifth:true,
              sixth:false,
            }})
    }
    if(event.target.value === "50000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:false,
              fifth:false,
              sixth:true,
            }})
    }
  }


  render() {
    let strings = new LocalizedStrings({
      en:{
        selectRadius: "Select search radius:",
      },
      fi: {
        selectRadius: "Valitse etsintä säde:",
      }
    });
    strings.setLanguage(this.props.match.params.language);
    return(
      !this.props.isGeolocationAvailable? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
      ? <div id="map" >
          <MapComponent language={this.props.match.params.language}
          latitude={this.state.center[0]} longitude={this.state.center[1]}
          searchRadiusInKm={this.state.radius}/>
          <form name="Select radius" onChange={this.RadiusChanged}>
            <Label>{strings.selectRadius}</Label>
            <input type="radio" name="group1" value="2000"  checked={this.state.checkboxes.first} /> 2 km <br/>
            <input type="radio" name="group1" value="5000"  checked={this.state.checkboxes.second} /> 5 km <br/>
            <input type="radio" name="group1" value="10000" checked={this.state.checkboxes.third} /> 10 km <br/>
            <input type="radio" name="group1" value="15000" checked={this.state.checkboxes.fourth} /> 15 km <br/>
            <input type="radio" name="group1" value="25000" checked={this.state.checkboxes.fifth} /> 25 km <br/>
            <input type="radio" name="group1" value="50000" checked={this.state.checkboxes.sixth} /> 50 km <br/>
          </form>
        </div>
      :this.props.coords
      ?<div id="map" >
        <MapComponent language={this.props.match.params.language}
        latitude={this.props.coords.latitude} longitude={this.props.coords.longitude}
        searchRadiusInKm={this.state.radius}/>
        <form name="Select radius" onChange={this.RadiusChanged} className="RadiusSelect">
            <div>{strings.selectRadius}</div>
            <input type="radio" name="group1" value="2000"  checked={this.state.checkboxes.first} /> 2 km <br/>
            <input type="radio" name="group1" value="5000"  checked={this.state.checkboxes.second} /> 5 km <br/>
            <input type="radio" name="group1" value="10000" checked={this.state.checkboxes.third} /> 10 km <br/>
            <input type="radio" name="group1" value="15000" checked={this.state.checkboxes.fourth} /> 15 km <br/>
            <input type="radio" name="group1" value="25000" checked={this.state.checkboxes.fifth} /> 25 km <br/>
            <input type="radio" name="group1" value="50000" checked={this.state.checkboxes.sixth} /> 50 km <br/>
        </form>
      </div>
      : <div>Getting the location data&hellip; </div>
    )
  }
}

export default geolocated({positionOptions:{enableHighAccuracy: false,},userDescisionTimeout:5000,})(Map);
