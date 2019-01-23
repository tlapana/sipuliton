/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
//import ReactLoading from 'react-loading';
import { Redirect } from 'react-router-dom';
import LocalizedStrings from 'react-localization';

import SearchBar from './SearchBar.js'
import Events from './Events.js'
//import SearchResults from './SearchResults.js'


//Styles
import '../../../styles/landingpage.css';

class Home extends React.Component {

  constructor(props) {
    super(props);

    //Bind the functions
    this.setState = this.setState.bind(this);
    this.handleResults = this.handleResults.bind(this);
    this.searching = this.searching.bind(this);
    this.errorHappened = this.errorHappened.bind(this);

    this.state = {
      searchDone: false,
      restaurants: [],
      searchInProgress: false,
      error: null,
      userLocationAllowed: false
    };
  }

  //Once all components have been mounted, run this. Asks user if the location data is allowed
  componentDidMount() {
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          error: null,
          userLocationAllowed: true
        });
        console.log("User location allowed")
      },
        (error) => this.setState({ error: error.message, userLocationAllowed: false}),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    
    this._isMounted = true;
  }

  //When we get results, we need to collect them and set our searchDone to true
  handleResults(results) {
    //console.log("handleResults: Setting restaurants, searchDone to true, searchInProgress to false and error to null");
    this.setState({
      restaurants : results,
      searchDone : true,
      searchInProgress : false,
      error : null
    });

    console.log("A search was done with following results:");
    console.log(this.state.restaurants);
    console.log(this.state.searchDone);
  }

  //Toggles flag that search is being done
  searching() {
    //console.log("searching: Setting searchInProgress to true, searchDone to false and error to null");
    this.setState({
      searchInProgress : true,
      searchDone : false,
      error : null,
    });
  }


  //Thi is used in the even to fo error happening
  //Right now it doesn't do much, because the console.logs are commented out
  errorHappened(errorMsg) {
    //console.log("errorHappened: Setting error and searchInProgress to false");
    this.setState({
      error : errorMsg,
      searchInProgress : false
    });

    //console.log(errorMsg);
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
    if(this.props.match.params.language === "about"){
      return(
        <Redirect to={"/fi/about"}/>
      )
    }

    let strings = new LocalizedStrings({
      en:{
        search:"Searching restaurants",
        errorTitle:"Error",
        errorText:"If this problem continues please contact support"
      },
      fi: {
        search:"Haetaan ravintoloita",
        errorTitle:"Virhe",
        errorText:"Jos tämä ongelma jatkuu, ole hyvä ja ota yhteyttä ylläpitoon"
      }
    });
    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);


    return ( 
      <div className="landingDiv">
        <SearchBar onSearchDone={this.handleResults} searching={this.searching} onError={this.errorHappened} userLocationAllowed={this.state.userLocationAllowed}
          language={this.props.match.params.language}
        />
        <Events userLocationAllowed={this.state.userLocationAllowed} language={this.props.match.params.language} />
      </div>
    );

  }

}

export default Home;
