import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';

class SearchButton extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.doSearch = this.doSearch.bind(this);

    this.state = {
      isLoading: false
    };
  }
  
  doSearch() {}
  
  render() {
    
    return (      
      <form id="search-form" class="search">
      <input type="text" name="search" className={styles.round} placeholder="Hae kaupungista tai osoitteesta..." />
      <button type="submit" className={styles.searchBtn} onClick={this.doSearch}>
          <FontAwesomeIcon icon="search" />
      </button>
      <br />
      <br />
      <button class="filterBtn">Rajaa</button>
    </form>
    );
  }
}