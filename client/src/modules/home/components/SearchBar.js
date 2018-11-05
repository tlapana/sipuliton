import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';

class SearchBar extends React.Component {

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
      <div className="searchDiv">
        <form id="search-form" className="search">
          <input type="text" name="search" className="round" placeholder="Hae kaupungista tai osoitteesta..." />
          <button type="submit" className="searchBtn" onClick={this.doSearch}>
              <FontAwesomeIcon icon="search" />
          </button>
          <br />
          <br />
          <button className="filterBtn">Rajaa</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
