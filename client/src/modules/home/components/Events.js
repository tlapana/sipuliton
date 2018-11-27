/*

  This file contains the events(restaurants) that are show on the landing page below the search bar

*/

import React from 'react';
import LocalizedStrings from 'react-localization';
import ReactLoading from 'react-loading';
import EventBlock from './EventBlock';

class Events extends React.Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      restaurants: []
    };
  }
  
  /** Once the object has been added to the tree, load up the data from the server **/
  componentDidMount() {
    console.log("DEBUG: ComponentsDidMount entered");
    
    fetch("http://localhost:3000/landing")
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
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
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
        suggestions:"Restaurants you might be interested:"
      },
      fi: {
        loading:"Ladataan ehdotuksia...",
        suggestions:" Ravintoloita joista voisit olla kiinnostunut:"
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
    } else if (!isLoaded) {
      return (
        <div className="eventsDiv"> 
          <h3>
            {strings.loading}
            <ReactLoading type={'spokes'} className="loadingSpinner" />
          </h3>
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