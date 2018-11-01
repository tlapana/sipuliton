/*

  This file contains the search bar functionality, as well as filter system.

*/

import React from 'react';
import { Button, UncontrolledTooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';

class SearchBar extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    this.doSearch = this.doSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    
    this.state = {
      isLoading: false,
      popoverOpen: false,
      filters : [],
      keywords : 'placeholder, another place holder, test,    lot of empty space      , double  space  between  words'
    };
  }
  
  //Toggles popover
  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
    console.log("Toggling popover, new state is: " + this.state.popoverOpen);
  }
  
  //Actual search event
  doSearch  = event =>{
    
      event.preventDefault();
      
      console.log("Doing search")
      //First, split off various keywords. Separator is ','
      var searchTerms = this.state.keywords.split(',');
      //Remove whitespaces      
      for( var i = 0; i < searchTerms.length; i++)
      {
        searchTerms[i] = searchTerms[i].trim();
      }
      
      //Console log test to se that we got what we wanted
      console.log(searchTerms);
  }
  
  render() {
    
    
    return (
      <div className="searchDiv">
        <form id="search-form" class="search" onSubmit={this.login}>
          <input type="text" name="search" className="round" placeholder="Hae kaupungista tai osoitteesta..." />
          <button type="submit" className="searchBtn" onClick={this.doSearch}>
              <FontAwesomeIcon icon="search" />
          </button>
          <span className="instructions" id="instructions-symbol"> ??? </span>  
           <UncontrolledTooltip placement="right" target="instructions-symbol">
            Käytä pilkkua ( , ) erottimena
          </UncontrolledTooltip>
            
          <br />
          <br />
          
          <button className="filterBtn" id="filter_popover" onClick={this.toggle} type="button" >Rajaa</button>
          
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="filter_popover" toggle={this.toggle}>
            <PopoverHeader>Popover Title</PopoverHeader>
            <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
          </Popover>
        </form>
      </div>  
    );
  }
}

export default SearchBar;