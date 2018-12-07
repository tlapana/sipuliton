/*
  This file contains how the search results are shown
*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LocalizedStrings from 'react-localization';
import EventBlock from './EventBlock';

class SearchResults extends React.Component {

constructor(props) {
    super(props);
    this.renderWeblink = this.renderWeblink.bind(this);
    
    this.state = {
      error: null,
      restaurants: props.restaurants.restaurants
    };
  }

  //Prints out how many stars the restaurant has
  renderStars(starCount) {
    const starIcons = [];
    while(starCount >= 1) {
      starIcons.push(<FontAwesomeIcon icon="star" key={starIcons.length} />);
      starCount = starCount - 1;
    }
    if(starCount >= 0.5) {
      starIcons.push(<FontAwesomeIcon icon="star-half" key={0.5} />);
    }
    return starIcons;
  }
  
  renderWeblink(address) {
    if(address != null) {
      return ([<a href={address}> {address} </a>, <br/>]);
    }
    else {
      return ('');
    }
  }

  render() {
    let strings = new LocalizedStrings({
      en:{
        searchresults:"Search found ",
        restaurants:" restaurants: ",
      },
      fi: {
        searchresults:"Haulla löytyi ",
        restaurants:" ravintolaa: ",
      }
    });

    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);
    const restaurants = this.state.restaurants;

    return (
      <div className="eventsDiv">
        <h3>{strings.searchresults + restaurants.length + strings.restaurants}</h3>

        {restaurants.map((restaurant) =>
          <EventBlock 
            restaurant={restaurant}
            language={language}
            key={restaurant.restaurant_id}
          />
        )}

      </div>
    );
  }

}

export default SearchResults;
