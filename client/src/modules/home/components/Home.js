/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import styles from '../../../styles/landingpage.css';
import SearchBar from './SearchBar.js'
import Events from './Events.js'

class Home extends React.Component {
  render() {
    return (  
    <div className="landingDiv">  
      <SearchBar />  
      <Events />
		</div>
    );
  }
}

export default Home;
