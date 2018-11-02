/*

  This file contains the search bar functionality, as well as filter system.

*/

import React from 'react';
import { Button, UncontrolledTooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../../styles/landingpage.css';

class SearchBar extends React.Component {
  
  constructor(props, context) {
    super(props, context);

    //Bind the functions
    this.togglePopover = this.togglePopover.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
    this.getOptions = this.getOptions.bind(this);
    
    this.state = {
      isLoading: true,
      loadedDefaults: false,
      loadedOptions: false,
      popoverOpen: false,
      filters : [],
      keywords : 'placeholder, another place holder, test,    lot of empty space      , double  space  between  words'
    };
  }
  
  //Toggles popover
  togglePopover() {
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
  
  
  //Get the default selections. Mainly checks if user is logged in if is, then get the data
  getDefaultValues() {
    
    const defaultValues = [];
    this.state.loadedDefaults = true;
    return defaultValues;
  }
  
  //This gets the options for the selection
  getOptions() {
    
    
    
    const options = [
      { value: 'onions', label: 'Allergia/Sipuli' },
      { value: 'tomato', label: 'Allergia/Tomaatti' },
      { value: 'nuts', label: 'Allergia/Pähkinä' },
      { value: 'lactose', label: 'Laktoositon ruokavalio' },
      { value: 'coeliac ', label: 'Keliakia' }
    ]
    console.log("Getting the options: ")
    console.log(options);
    
    this.state.loadedOptions = true;
    
    return options;
  }
  
  renderFilterButton()
  {
    if( this.state.loadedDefaults && this.state.loadedOptions) {
      return (
        <button type="submit" className="searchBtn" onClick={this.doSearch}>
          <FontAwesomeIcon icon="search" />
        </button>
      );
    }    
    else {
      return (
        "Ladataan tietoja..."
      );
    }
    
  }
  
  
  
  render() {
    
    
    return (
      <div className="searchDiv">
        <form id="search-form" class="search" onSubmit={this.login}>
        
          <input type="text" name="search" className="round" placeholder="Hae kaupungista tai osoitteesta..." />
          
          
          <span className="instructions" id="instructions-symbol"> ??? </span>  
           <UncontrolledTooltip placement="right" target="instructions-symbol">
            Käytä pilkkua ( , ) erottimena
          </UncontrolledTooltip>
          
          <br />
          
          <button className="filterBtn" id="filter_popover" onClick={this.togglePopover} type="button" >Rajaa</button>     
          
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="filter_popover" toggle={this.togglePopover}>
            <PopoverHeader></PopoverHeader>
            <PopoverBody>
              Sisällytä hakuun: <br />
              <Select
                defaultValue={ this.getDefaultValues() }
                isMulti
                name="colors"
                options={ this.getOptions() }
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </PopoverBody>
          </Popover>
          
        </form>
      </div>  
    );
  }
}

export default SearchBar;