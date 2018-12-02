import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EventBlock extends React.Component {  

  //Prints out how many stars the restaurant has
  renderStars(starCount) {
    const starIcons = [];
    while(starCount >= 1) {
      starIcons.push(<FontAwesomeIcon icon="star" key={starCount} />);
      starCount = starCount - 1;
    }
    if(starCount >= 0.5) {
      starIcons.push(<FontAwesomeIcon icon="star-half" key={starCount} />);
    }
    return starIcons;
  }
  
  render() {
    const restaurant = this.props.restaurant; 
    const language = this.props.language == null ? 'fi' : this.props.language;
    let address = restaurant.street_address;
    if (restaurant.city_name) {
      address += ', ' + restaurant.city_name;
    }
    
    return (
      <div className="event">
        <a className="restaurant-name" href={'/' + language + '/restaurant/' + restaurant.restaurant_id}>
          {restaurant.restaurant_name}
        </a>
        <div className="restaurant-info">
          <span className="restaurant-stars">
            {this.renderStars(restaurant.rating_overall)}
          </span>
          <span className="restaurant-address">
            {address}
          </span>
        </div>
      </div>
    );
  }
  
}

export default EventBlock;
