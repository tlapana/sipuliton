/*
  This file contains the review page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import '../../../styles/writereview.css';
import WriteReview from "./WriteReview.js"

export default class ReviewPage extends React.Component {
  
  constructor(props, context) {    
    super(props);    
  }  
  
  render() { 
    console.log("ReviewPage");
    return ( 
      <div>
        <WriteReview language={this.props.match.language} restaurantID={1} />
      </div>
    );    
  }
  
}
