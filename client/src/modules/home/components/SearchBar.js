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
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    
    this.state = {
      isLoading: true,
      loadedDefaults: false,
      loadedOptions: false,
      popoverOpen: false,
      filters : [],
      keywords : '',
      options : [],
      defaultValues : []
    };
  }
  
  componentDidMount() {
    
    this.setState({ 
      options : this.getOptions(),
      defaultValue : this.getDefaultValues()
    });
    
  }
  
  //Toggles popover
  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
    console.log("Toggling popover, new state is: " + this.state.popoverOpen);
  }
  
  //Actual search event. It also sends signal to the parent by using props.SearchDone, which signals it has done a search and this.props.searchResults which has the results
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
      console.log("Search terms: ");
      console.log(searchTerms);
      console.log("Filters: ");
      console.log(this.state.filters);
      
      const results = [
        { name: 'Search Result 1', rating_overall: 3,   street_address : "Katu 1" },
        { name: 'Search Result 2', rating_overall: 4,   street_address : "Katu 2" },
        { name: 'Search Result 3', rating_overall: 3.7, street_address : "Katu 3" },
        { name: 'Search Result 4', rating_overall: 5,   street_address : "Katu 4" },
        { name: 'Search Result 5', rating_overall: 2.2, street_address : "Katu 5" },
        { name: 'Search Result 6', rating_overall: 3.3, street_address : "Katu 6" },
      ];
      
      console.log("Sending results");
      console.log(results);
      
      //Send data via props
      this.props.onSearchDone( results );
      
  }
  
  
  //Get the default selections. Mainly checks if user is logged in if is, then get the data
  getDefaultValues() {
    
    const defaultValues = [];
    this.setState({ 
      loadedDefaults : true
    });
    return defaultValues;
  }
  
  //This gets the options for the selection. 
  getOptions() {
    
    const options = [
      { value: 'onions', label: 'Allergia/Sipuli' },
      { value: 'tomato', label: 'Allergia/Tomaatti' },
      { value: 'nuts', label: 'Allergia/Pähkinä' },
      { value: 'lactose', label: 'Laktoositon ruokavalio' },
      { value: 'coeliac ', label: 'Keliakia' }
    ];
    console.log("Getting the options: ");
    console.log(options);
    
    this.state.loadedOptions = true;
    
    this.setState({ 
      loadedOptions : true
    });
    
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
  
  //Used for the keyword change
  handleKeywordChange(event) {
    //console.log("Changing selected keywords");
    this.setState({keywords: event.target.value});
    //console.log(event.target.value);
    //console.log(this.state.keywords);
  }
  
  //Used to acknowledge change and store new values
  handleFilterChange(selectedOptions) {
    //console.log("Changing selected filters");   
    this.setState({ 
      filters : selectedOptions
    });
    //console.log(selectedOptions);
    //console.log(this.state.filters);   
  }
  
  render() {
    
    
    return (
      <div className="searchDiv">
        <form id="search-form" className="search" onSubmit={this.login}>
        
          <input type="text" value={this.state.keywords} onChange={this.handleKeywordChange} className="round" placeholder="Hae..." />
           <button type="submit" className="searchBtn" onClick={this.doSearch}>
              <FontAwesomeIcon icon="search" />
          </button>
          
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
                defaultValue={ this.state.defaultValues }
                isMulti
                name="filtersDrop"
                options={ this.state.options }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={this.handleFilterChange}
              />
            </PopoverBody>
          </Popover>
          
        </form>
      </div>
    );
  }
}

export default SearchBar;
