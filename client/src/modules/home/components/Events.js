/*
  This file contains the events(restaurants) that are show on the landing page below the search bar
*/

import React from 'react';
import LocalizedStrings from 'react-localization';
import ReactLoading from 'react-loading';
import EventBlock from './EventBlock';
import Config from '../../../config.js';
class Events extends React.Component {

  constructor(props) {
    super(props);

    this.getSuggestions = this.getSuggestions.bind(this);


    this.state = {
      error: null,
      isLoaded: false,
      restaurants: [],
      userLocationAllowed: props.userLocationAllowed,
      latitude : 0,
      longitude : 0
    };
  }

  /** Once the object has been added to the tree, load up the data from the server **/
  componentDidMount() {
    console.log("DEBUG: ComponentsDidMount entered");

    //Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          userLocationAllowed: true
        });
        console.log("DEBUG: Events.js userLocationAllowed true")
        //console.log("Latitude: " + this.state.latitude + " Longitude: " + this.state.longitude);
        this.getSuggestions();
      },
      (error) => this.setState({ error: error.message, userLocationAllowed: false, isLoaded: true }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );


  }

  getSuggestions()
  {
    var url = Config.backendAPIPaths.BASE+"/search?maxDistance=10000&pageSize=5&orderBy=rating_overall"
                  + "&currentLatitude=" + this.state.latitude
                  + "&currentLongitude=" + this.state.longitude;

    //var url = Config.backendAPIPaths.BASE+"/landing";
    console.log("Searching");
    console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("DEBUG: ComponentsDidMount success");
          console.log(result);
          this.setState({
            isLoaded: true,
            restaurants: result.restaurants
          });
        },
        (error) => {
          console.log("DEBUG: ComponentsDidMount error");
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, restaurants } = this.state;
    let strings = new LocalizedStrings({
      en:{
        loading:"Loading suggestions...",
        suggestions:"Restaurants you might be interested:",
        noLocation:"Can not show suggestion because location is not enabled"
      },
      fi: {
        loading:"Ladataan ehdotuksia...",
        suggestions:" Ravintoloita joista voisit olla kiinnostunut:",
        noLocation:"Ehdotuksia ei voida näyttää koska sijainti ei ole käytössä"
      }
    });

    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);
    if (error) {
      return (
        <div className="eventsDiv">
          <div className="event">
            Error: {error.message}
          </div>
        </div>
      );
    } else if (!this.state.isLoaded) {
      return (
        <div className="eventsDiv">
          <h3>
            {strings.loading}
            <ReactLoading type={'spinningBubbles'} className="loadingSpinner" />
          </h3>
        </div>
      );
    } else if (this.state.userLocationAllowed)
	{
	   return (
         <div className="eventsDiv">
          <h3> {strings.suggestions} </h3>
          {restaurants.map((restaurant) =>
            <EventBlock
              Ehdotuksia ei voida hakea
            />
          )}
        </div>
      );
	} else {
      return (
         <div className="eventsDiv">
          <h3> {strings.suggestions} </h3>
          {restaurants.map((restaurant) =>
            <EventBlock
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              language={language}
            />
          )}
        </div>
      );

    }
  }
}

export default Events;
