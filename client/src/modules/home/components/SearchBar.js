/*

  This file contains the search bar functionality, as well as filter system.

*/

import React from 'react';
import { 
  Button, Input, InputGroup, InputGroupAddon, UncontrolledTooltip, 
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import ReactStars from 'react-stars';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* Localization */
import LocalizedStrings from 'react-localization';

class SearchBar extends React.Component {

  constructor(props, context) {
    super(props, context);

    //Bind the 
    this.toggleModal = this.toggleModal.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    
    this.changeOverall = this.changeOverall.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeVariety = this.changeVariety.bind(this);
    this.changeService = this.changeService.bind(this);
    this.changePricing = this.changePricing.bind(this);

    this.state = {
      isLoading: true,
      loadedDefaults: false,
      loadedOptions: false,
      popoverOpen: false,
      modalState: false,
      filters : [],
      keywords : '',
      options : [],
      defaultValues : [],
      minOverall : 0, 
      minReliability : 0,
      minVariety : 0,
      minService : 0,
      pricing: 0
      
    };
  }

  componentDidMount() {

    this.setState({
      options : this.getOptions(),
      defaultValue : this.getDefaultValues()
    });

  }
  
  //Toggles modal
  toggleModal() {
    
    this.setState({
      modalState: !this.state.modalState
    });
    
    console.log("showModal: Toggling modal to " + this.state.modalState)
  }  
  

  //Toggles popover
  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
    //console.log("Toggling popover, new state is: " + this.state.popoverOpen);
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
      
      //Basic search portion
      var url = 'http://localhost:3000/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                  + '&minOverallRating=' + this.state.minOverall
                  + '&minReliabilityRating=' + this.state.minReliability
                  + '&minVarietyRating=' + this.state.minService
                  + '&minServiceAndQualityRating=' + this.state.minVariety;
                  
      console.log("URL to fetch from: " + url)           ; 
      this.props.searching();
      fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Sending results");
          console.log(result);

          //Send data via props
          this.props.onSearchDone( result );
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("DEBUG: ComponentsDidMount error");
          console.log(error);
          this.props.onError( error )
        }
      )

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
      { value: '1', label: 'Allergia/Sipuli' },
      { value: '2', label: 'Allergia/Tomaatti' },
      { value: '3', label: 'Allergia/Pähkinä' },
      { value: '4', label: 'Laktoositon ruokavalio' },
      { value: '5 ', label: 'Keliakia' }
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
  
  //Used to change star rating values
  changeOverall(newRating, name)
  {
    this.setState({
      minOverall : newRating
    });
  }  
  changeReliability(newRating, name)
  {
    this.setState({
      minReliability : newRating
    });
  }  
  changeService(newRating, name)
  {
    this.setState({
      minService : newRating
    });
  }  
  changeVariety(newRating, name)
  {
    this.setState({
      minVariety : newRating
    });
  }
  changePricing(newRating, name)
  {
    this.setState({
      pricing : newRating
    });
  }

  render() {
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        search:"Search restaurants...",
        usecommaasaseparator:"Use comma ( , ) as a separator.",
        filter:"Filter",
        includeinsearch:"Include in search:",
        diets: "Diets",
        closeModal:"Close",
        overall:"Overall rating",
        reliability:"Menu reliability",
        service:"Service & Food",
        variety:"Menu variety",
        pricing:"Pricing"
      },
      fi: {
        search:"Hae ravintoloita...",
        usecommaasaseparator:"Käytä pilkkua ( , ) erottimena.",
        filter:"Rajaa",
        includeinsearch:"Sisällytä hakuun:",
        diets: "Ruokavaliot",
        closeModal:"Sulje",
        overall:"Keskiarvo",
        reliability:"Ruokavalion luotettavuus",
        service:"Ruoka ja palvelu",
        variety:"Ruokalajien laajuus",
        pricing:"Hintaluokka"
      }
    });
    
    if(typeof this.props.language !== 'undefined'){
      strings.setLanguage(this.props.language);
    }
    else{
      strings.setLanguage('fi');
    }


    return (
      <div className="searchDiv">
        <form id="search-form" className="search" onSubmit={this.login}>

          <InputGroup>
            <Input type="text" value={this.state.keywords} onChange={this.handleKeywordChange} className="round" placeholder={strings.search} aria-label={strings.search} autoFocus />
            <InputGroupAddon addonType="append">
            <button type="submit" className="searchBtn main-btn btn" onClick={this.doSearch}>
                <FontAwesomeIcon icon="search" />
            </button>
            </InputGroupAddon>
          </InputGroup>

          <span className="instructions" id="instructions-symbol"> ??? </span>
           <UncontrolledTooltip placement="right" target="instructions-symbol">
            {strings.usecommaasaseparator}
          </UncontrolledTooltip>

          <button className="filterBtn main-btn btn" id="filter_popover" onClick={this.toggleModal} type="button" >{strings.filter}</button>

          <Modal isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBox">
          <ModalHeader>{strings.includeinsearch}</ModalHeader>
          <ModalBody className="filterBox">
            {strings.diets}
            <Select
              defaultValue={ this.state.defaultValues }
              isMulti
              name="filtersDrop"
              options={ this.state.options }
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={this.handleFilterChange}
            />
            {strings.overall}
            <ReactStars
              value = {this.state.minOverall}
              count = {5}
              size = {24}
              onChange = {this.changeOverall}
            />
            {strings.reliability}
            <ReactStars
              value = {this.state.minReliability}
              count = {5}
              size = {24}
              onChange = {this.changeReliability}
            />
            {strings.service}
            <ReactStars
              value = {this.state.minService}
              count = {5}
              size = {24}
              onChange = {this.changeService}
            />
            {strings.variety}
            <ReactStars
              value = {this.state.minVariety}
              count = {5}
              size = {24}
              onChange = {this.changeVariety}
            />
            {strings.pricing}
            <ReactStars
              value = {this.state.pricing}
              count = {3}
              size = {24}
              char = '€'
              half = {false}
              onChange = {this.changePricing}
            />
              
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}> {strings.closeModal} </Button>
          </ModalFooter>
        </Modal>

        </form>
      </div>
    );
  }
}

export default SearchBar;
