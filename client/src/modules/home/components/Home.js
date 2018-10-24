import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';
import SearchBar from './SearchBar.js'
import Events from './Events.js'

class Home extends React.Component {
  render() {
    return (  
    <div>  
      <SearchBar />  
      <Events />
    </div>
    );
  }
}

export default Home;
