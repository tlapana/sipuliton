/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import styles from '../../../styles/landingpage.css';
import SearchBar from './SearchBar.js'
import Events from './Events.js'
import SearchResults from './SearchResults.js'

class Home extends React.Component {
  
  constructor(props, context) {
    
    super(props);
    
    //Bind the functions
    this.setState = this.setState.bind(this);
    this.handleResults = this.handleResults.bind(this);
  
    this.state = {
      error: null,
      searchDone: false,
      restaurants: []
    };
  }
  
  componentDidMount() {
    this._isMounted = true;
  }
  
  //When we get results, we need to collect them and set our searchDone to truee
  handleResults(results) {
    
    
    this.setState({ 
      restaurants : results,
      searchDone : true
    });
    
    console.log("A search was done with following results:");
    console.log(this.state.restaurants);
    console.log(this.state.searchDone);
    
  }
  
  render() {
    
    if(!this.state.searchDone)
    {
      return (  
      <div className="landingDiv">  
        <SearchBar onSearchDone={this.handleResults} />  
        <Events />
      </div>
      );
    }
    else {  
      return (  
      <div className="landingDiv">  
        <SearchBar onSearchDone={this.handleResults} />  
        <SearchResults restaurants={this.state.restaurants} />
      </div>
      );      
    }
    
    
  }
  
}

export default Home;
