/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import styles from '../../../styles/landingpage.css';

class Write_Review extends React.Component {
  
  constructor(props, context) {
    
    super(props);
    
    //Bind the functions
    this.setState = this.setState.bind(this);
    this.handleResults = this.handleResults.bind(this);
  
    this.state = {
      error: null,
      loadingRestaurant: 1;
    };
  }
  
  componentDidMount() {
    this._isMounted = true;
  }
  
  
  
  
  render() {
    
    if(this.state.loadingRestaurant == 1)
    {
      return (  
      <div>  
        Ladataan ravintolaa...
      </div>
      );
    }
    else if {this.state.loadingRestaurant == 2)  
      return (  
      <div>  
        Ravintolaa ei löydy.
      </div>
      );      
    }
    else {
      return (
        <div>
          <form>
          </form>        
        </div>
      );
    }
    
    
  }
  
}

export default Home;
