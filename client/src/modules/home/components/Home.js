import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';



const Home = () => (
  <div>  
    <div className={styles.searchDiv}>
      <form id="search-form" class="search">
          <input type="text" name="search" className={styles.round} placeholder="Hae kaupungista tai osoitteesta..." />
          <button type="submit" class="searchBtn"><FontAwesomeIcon icon="search" /></button>
          <br />
          <br />
          <button class="filterBtn">Rajaa</button>
      </form>
    </div>    
    <div class="eventsDiv">
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
  </div>
);

export default Home;
