/*

  This file contains how the search results are shown

*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../styles/landingpage.css';

/* Localization */
import LocalizedStrings from 'react-localization';

class SearchResults extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      error: null,
      restaurants: props.restaurants.restaurants
    };

    console.log("SearchResults: Received following props:")
    console.log(props);
  }

  //Prints out how many stars the restaurant has
  renderStars(starCount)
  {
    //console.log("DEBUG: Starcount");
    //console.log(starCount);

    const starIcons = [];
    while(starCount >= 1)
    {
      starIcons.push(<FontAwesomeIcon icon="star" key={starIcons.length} />);
      starCount = starCount - 1;
    }
    //console.log(starCount);
    if(starCount >= 0.5)
    {
      starIcons.push(<FontAwesomeIcon icon="star-half" key={0.5} />);
      //console.log("Half star added");
    }
    //console.log(starIcons);
    return starIcons
  }

  render() {

    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        searchresults:"In search found ",
        restaurants:" restaurants: ",
      },
      fi: {
        searchresults:"Haulla löytyi ",
        restaurants:" ravintolaa: ",
      }
    });
    if(typeof this.props.language !== 'undefined'){
      strings.setLanguage(this.props.language);
    }
    else{
      strings.setLanguage('fi');
    }

    const restaurants = this.state.restaurants;

    return (
      <div className="eventsDiv">
        <h3> {strings.searchresults}{restaurants.length}{strings.restaurants}</h3>

          {restaurants.map((restaurant) =>
            <div className="event" key={restaurant.name}>
            {restaurant.restaurant_name} {this.renderStars(restaurant.rating_overall)} <br/>
            {restaurant.street_address}, {restaurant.city_name}
            </div>
          )}

      </div>
    );
  }

}

export default SearchResults;
