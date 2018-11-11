/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import SearchBar from './SearchBar.js'
import Events from './Events.js'
import SearchResults from './SearchResults.js'
import { Redirect } from 'react-router-dom';

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

    /*
    Redirects user back to correct place with default language,
    when language parameter is missing or deleted.
    */

    if(this.props.match.params.language === "admin"){
      return(
        <Redirect to={"/fi/admin"}/>
      )
    }
    if(this.props.match.params.language === "restaurant_management"){
      return(
        <Redirect to={"/fi/restaurant_management"}/>
      )
    }
    if(this.props.match.params.language === "restaurant_list"){
      return(
        <Redirect to={"/fi/restaurant_list"}/>
      )
    }
    if(this.props.match.params.language === "map"){
      return(
        <Redirect to={"/fi/map"}/>
      )
    }
    if(this.props.match.params.language === "login"){
      return(
        <Redirect to={"/fi/login"}/>
      )
    }
    if(this.props.match.params.language === "register"){
      return(
        <Redirect to={"/fi/register"}/>
      )
    }
    if(this.props.match.params.language === "profile"){
      return(
        <Redirect to={"/fi/profile"}/>
      )
    }
    if(this.props.match.params.language === "moderating"){
      return(
        <Redirect to={"/fi/moderating"}/>
      )
    }
    
    if(!this.state.searchDone)
    {
      return (
      <div className="landingDiv">
        <SearchBar onSearchDone={this.handleResults}
          language={this.props.match.params.language}/>
        <Events />
      </div>
      );
    }
    else {
      return (
      <div className="landingDiv">
        <SearchBar onSearchDone={this.handleResults}
          language={this.props.match.params.language}/>
        <SearchResults restaurants={this.state.restaurants}
          language={this.props.match.params.language}/>
      </div>
      );
    }


  }

}

export default Home;
