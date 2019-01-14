/*

  This file contains the search bar functionality, as well as filter system.

*/

import React from 'react';
import {
  Input, InputGroup, InputGroupAddon, UncontrolledTooltip,
  ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { Route, Redirect } from 'react-router'
import ReactStars from 'react-stars';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as AppImports from  '../../app';
import Config from '../../../config.js';
/* Localization */
import LocalizedStrings from 'react-localization';
import { string } from 'prop-types';

class SearchBar extends React.Component {

  constructor(props, context) {
    super(props, context);

    //Bind the methods
    this.toggleModal = this.toggleModal.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.searchUrl = this.searchUrl.bind(this);
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
      error : null,
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
      pricing: 0,
      redirectUser : false,
      latitude : 0,
      longitude : 0

    };
  }

  componentDidMount() {


    //Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

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
    console.log("showModal: Toggling modal to " + this.state.modalState);
  }


  //Toggles popover
  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  searchUrl() {
    var url = '/'+this.props.language+'/map?'
                + 'minOverallRating=' + this.state.minOverall
                + '&minReliabilityRating=' + this.state.minReliability
                + '&minVarietyRating=' + this.state.minService
                + '&minServiceAndQualityRating=' + this.state.minVariety
                + '&minPricing=' + this.state.pricing
                + '&searchLongitude=' + this.state.longitude
                + '&searchLatitude=' + this.state.latitude;
    return url;
  }

  //Actual search event. It also sends signal to the parent by using props.SearchDone,
  //which signals it has done a search and this.props.searchResults which has the results
  doSearch  = event => {
    event.preventDefault();
    console.log("Doing search");

    //First, split off various keywords. Separator is ','
    var searchTerms = this.state.keywords.split(',');

    //Remove whitespaces
    for( var i = 0; i < searchTerms.length; i++) {
      searchTerms[i] = searchTerms[i].trim();
    }

    //Console log test to se that we got what we wanted
    console.log("Search terms: ");
    console.log(searchTerms);
    console.log("Filters: ");
    console.log(this.state.filters);

    //Basic search portion


    var url = '/'+this.props.language+'/map?'
                + 'minOverallRating=' + this.state.minOverall
                + '&minReliabilityRating=' + this.state.minReliability
                + '&minVarietyRating=' + this.state.minService
                + '&minServiceAndQualityRating=' + this.state.minVariety
                + '&minPricing=' + this.state.pricing;

    //TODO: Check for city in the keywords


    console.log("URL:");
    console.log(url);

    this.setState({
      redirectUser: true
    });

    //Direct user to the map screen

    //Original version
    /*
    var url = Config.backendAPIPaths.BASE+'/search?pageSize=10&pageNumber=0&orderBy=rating_overall'
                + '&minOverallRating=' + this.state.minOverall
                + '&minReliabilityRating=' + this.state.minReliability
                + '&minVarietyRating=' + this.state.minService
                + '&minServiceAndQualityRating=' + this.state.minVariety;

    this.props.searching();
    */

    //Old way this was done
    /*
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        console.log("Sending results");
        console.log(result);
        this.props.onSearchDone( result );
      },
      (error) => {
        console.log("DEBUG: ComponentsDidMount error");
        console.log(error);
        this.props.onError( error );
      }
    );
    */
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

    this.setState({
      loadedOptions : true
    });

    return options;
  }

  renderFilterButton() {
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
    this.setState({keywords: event.target.value});
  }

  //Used to acknowledge change and store new values
  handleFilterChange(selectedOptions) {
    this.setState({
      filters : selectedOptions
    });
  }

  //Used to change star rating values
  changeOverall(newRating, name) {
    this.setState({ minOverall : newRating });
  }
  changeReliability(newRating, name) {
    this.setState({ minReliability : newRating });
  }
  changeService(newRating, name) {
    this.setState({ minService : newRating });
  }
  changeVariety(newRating, name) {
    this.setState({ minVariety : newRating });
  }
  changePricing(newRating, name) {
    this.setState({ pricing : newRating });
  }

  render() {
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
        pricing:"Pricing",
        selectPlaceholder:"Select diets...",
        noOptionsMessage:"No diets",
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
        pricing:"Hintaluokka",
        selectPlaceholder:"Valitse ruokavalioita...",
        noOptionsMessage:"Ei ruokavalioita",
      }
    });
    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);

    const ThemedModalContainer = AppImports.containers.ThemedModalContainer;
    if(this.state.redirectUser) {
      console.log(this.searchUrl());
      return (<Redirect to={this.searchUrl()} />);
    }
    else {

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

            <ThemedModalContainer isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBox">
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
                  placeholder={strings.selectPlaceholder}
                  noOptionsMessage={() => {return strings.noOptionsMessage}}
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
                <button className="btn main-btn" onClick={this.toggleModal}> {strings.closeModal} </button>
              </ModalFooter>
            </ThemedModalContainer>

          </form>
        </div>
      );
    }
  }
}

export default SearchBar;
