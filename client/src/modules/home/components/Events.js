import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';

class Events extends React.Component {
  
  render() {
    
    return (  
      <div class="eventsDiv">
        <h3>Sinua mahdolliseti kiinnotavia kohteita: </h3>
        <div class="event">
          Event
        </div>
        <div class="event">
          Event
        </div>
        <div class="event">
          Event
        </div>
      </div>
    );
  }
}

export default Events;