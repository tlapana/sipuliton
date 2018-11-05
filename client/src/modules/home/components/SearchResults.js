/*

  This file contains how the search results are shown

*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../styles/landingpage.css';

class SearchResults extends React.Component {  
  
constructor(props) {
    super(props);
    this.state = {
      error: null,
      restaurants: props.restaurants
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
    
    const restaurants = this.state.restaurants;
    
    return (
      <div className="eventsDiv"> 
        <h3> Haulla löytyi {restaurants.length} ravintolaa: </h3>
        
          {restaurants.map((restaurant) =>
            <div className="event" key={restaurant.name}>
            {restaurant.name} {this.renderStars(restaurant.rating_overall)} <br/>
            {restaurant.street_address}
            </div>
          )}
          
      </div>
    );
  }
  
}

export default SearchResults;