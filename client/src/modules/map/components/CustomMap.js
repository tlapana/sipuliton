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
    }
  }
  render() {

    const position = [this.state.lat, this.state.lng]

    //icon for the search result
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
     const greyIcon = L.icon({
          iconUrl: require('../../../resources/englanninlippu_logo.ico'),
          iconSize: [64,64],
          iconAnchor: [32, 64],
          popupAnchor: [-3, -76],
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null
      });


    return(

        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[this.state.lat, this.state.lng]} icon={redIcon}>
            <Popup>Kaalikeskus<br/>
            <Button>Ravintolan sivulle</Button></Popup>
          </Marker>
          <Marker position={[this.state.lat+0.001, this.state.lng+0.001]} icon={greyIcon}>
            <Popup>Tämä ravintola on ehdotus,<br/>koska haku tuloksia oli vähän.<br/>
            <Button>Ravintolan sivulle</Button></Popup>
          </Marker>
        </Map>

    )
  }
}

export default CustomMap;
