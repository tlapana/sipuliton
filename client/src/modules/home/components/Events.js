/*

  This file contains the events(restaurants) that are show on the landing page below the search bar

*/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../styles/landingpage.css';

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
  
  //Prints out how many stars the restaurant has
  renderStars(starCount)
  {
    //console.log("DEBUG: Starcount");
    //console.log(starCount);
    
    const starIcons = [];
    while(starCount >= 1)
    {
      starIcons.push(<FontAwesomeIcon icon="star" />);
      starCount = starCount - 1;
    }
    //console.log(starCount);
    if(starCount >= 0.5)
    {
      starIcons.push(<FontAwesomeIcon icon="star-half" />);
      //console.log("Half star added");
    }
    //console.log(starIcons);
    return starIcons
  }
  
  render() {
    
    const { error, isLoaded, restaurants } = this.state;
    
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
          <div className="event">
            Ladataan ehdotuksia...
          </div>
        </div>
      );
      
    } else {
      return (
         <div className="eventsDiv"> 
          <h3> Ravintoloita joista voisit olla kiinnostunut: </h3>
          {restaurants.map((restaurant) =>
            <div className="event" key={restaurant.name} >
              {restaurant.name} {this.renderStars(restaurant.rating_overall)} <br/>
              {restaurant.street_address}
            </div>
          )}      
        </div>
      );
      
    }
  }
  
}

export default Events;