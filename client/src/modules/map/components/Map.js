import React from 'react';

/* Map component import */
import MapComponent from "./CustomMap"
import '../../../styles/map.css';


class Map extends React.Component {
  /* Constructor of the navication bar class. */
  render() {
    return(
      <div id="map" >
        <MapComponent language={this.props.match.params.language}/>
      </div>
    )
  }
}

export default Map;
