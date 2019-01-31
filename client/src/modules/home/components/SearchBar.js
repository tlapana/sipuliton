/*

  This file contains the search bar functionality, as well as filter system.

*/

import React from 'react';
import {
  Input, InputGroup, InputGroupAddon, UncontrolledTooltip,
  ModalHeader, ModalBody, ModalFooter, Label
} from 'reactstrap';
import { Route, Redirect } from 'react-router'
import ReactStars from 'react-stars';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API } from "aws-amplify";

import Slider from 'rc-slider';

import * as AppImports from  '../../app';

import Config from '../../../config.js';


/* THIS IS A TEST SECTION! REMOVE ONCE NO LONGER NEEDED! */
/* Localization */
import LocalizedStrings from 'react-localization';
import { string } from 'prop-types';

class SearchBar extends React.Component {

  constructor(props, context) {
    super(props, context);

    //Bind the methods
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSearchField = this.toggleSearchField.bind(this);
    this.searchUrl = this.searchUrl.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.getDiets = this.getDiets.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.changeOverall = this.changeOverall.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeVariety = this.changeVariety.bind(this);
    this.changeService = this.changeService.bind(this);
    this.changePricing = this.changePricing.bind(this);
    this.distanceSelector = this.distanceSelector.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
	this.resetFilters = this.resetFilters.bind(this);

    this.renderDistance = this.renderDistance.bind(this);
    this.renderDiets = this.renderDiets.bind(this);

	//Starting state
    this.state = {
      error : null,
      isLoading: true,
      loadedDefaults: false,
      loadedDiets: false,
      popoverOpen: false,
      modalState: false,
      selectedDiets : [],
      keywords : '',
      diets : [],
      defaultValues : [],
      minOverall : 0,
      minReliability : 0,
      minVariety : 0,
      minService : 0,
      pricing: 0,
      redirectUser : false,
      latitude : 0,
      longitude : 0,
      searchFieldDisabled: false,
      userLocationAllowed: false,
      useUserLocation: false,
      userDiets: [],
      radius: 10000,
      dietError: null,
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
          userLocationAllowed: true
        });
      },
      (error) => this.setState({ error: error.message, userLocationAllowed: false}),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    //Get the diets
    this.getDiets();
    this.getDefaultValues();

  }

  //Toggles modal
  toggleModal() {
    this.setState({
      modalState: !this.state.modalState
    });
    //console.log("DEBUG: SearchBar.js showModal(): Toggling modal to " + this.state.modalState);
  }


  //Toggles search field
  toggleSearchField() {
    this.setState({
      searchFieldDisabled: !this.state.searchFieldDisabled,
      useUserLocation: !this.state.useUserLocation,
    });
    //console.log("DEBUG: SearchBar.js ToggleSearchField()");
    //console.log(this.state.useUserLocation);
  }


  //Does the search by generating URL we pass to map
  searchUrl() {
    var dietParam = "&diets=[]";
    console.log(this.state.selectedDiets)
    if(this.state.selectedDiets != undefined && this.state.selectedDiets.length>0)
    {
      var searchDiets = [];
      for(var i = 0; i<this.state.selectedDiets.length; ++i)
      {
        searchDiets.push(this.state.selectedDiets[i].value);
      }
      var diet_ids = searchDiets;
      var diet_array_string = "[";
      for(var i = 0; i<diet_ids.length-1; ++i)
      {
        if(diet_ids[i] !== undefined)
        {
          diet_array_string = diet_array_string+diet_ids[i]+',';
        }
      }
      diet_array_string = diet_array_string+diet_ids[diet_ids.length-1]+']';
      dietParam = '&diets='+diet_array_string;
    }
    var url = '/'+this.props.language+'/map?'
                + 'minOverallRating=' + this.state.minOverall
                + '&minReliabilityRating=' + this.state.minReliability
                + '&minVarietyRating=' + this.state.minService
                + '&minServiceAndQualityRating=' + this.state.minVariety
                + '&minPricing=' + this.state.pricing
                + dietParam;


    if(this.state.useUserLocation) {
      url = url + '&searchLongitude=' + this.state.longitude + '&searchLatitude=' + this.state.latitude;
    }
    else{
      url = url + "&city=" + this.state.keywords;
    }

    return url;
  }

  //Actual search event. It doesn't actually do a search, but rather signals the page to redirect user to map page
  doSearch  = event => {
    event.preventDefault();
    //Set redirectUser to true, so that the page reloads and detects the redirect command.
    this.setState({
      redirectUser: true
    });

  }

  //This gets the options for the selection.
  getDiets() {
    //console.log("Fetching diets")
    fetch( Config.backendAPIPaths.BASE + "/diet/all")
      .then(res => res.json())
      .then(
        (result) => {
          //Process results into ones that can be used by the select

          var diets = []
          for(var i = 0; i < result.length; i++)
          {
            diets.push({ value: result[i].global_diet_id, label: result[i].name});
          }
          //console.log("DEBUG: SearchBar.js getDiets()")
          //console.log(diet)

          this.setState({
            loadedDiets: true,
			diets: diets
          });
          //console.log("DEBUG: SearchBar getDiets(): Success fetching diets: " + this.state.diets)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          //console.log("Error fetching diets: " + error)
          this.setState({
            loadedDiets: true,
            dietError : error,
          });
        }
      )
  }

  //Get user default diets.
  getDefaultValues()
  {
    //Console log for debugging
    //console.log("Getting the default values for the diets: ");
    let init = { queryStringParameters: {} };
    API.get('api', '/ownDiets', init)
      .then(
        (result) => {
          //Console log for debugging
          //console.log("Sending results");
          //console.log(result);
          var defValues = [];
          //Send data via props
          result.own_diets.forEach(function(element) {
            defValues.push({value:element.global_diet_id, label:element.name});
          });

          this.setState({
            loadedDefaults : true,
            selectedDiets : defValues,
			userDiets : defValues
          });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        //console.log("DEBUG: ComponentsDidMount error");
        console.log(error);
      }
    ).then(() => this.setState({loading:false}));
  }

  //Renders filtering button
  renderFilterButton() {
    if( this.state.loadedDefaults && this.state.loadedDiets) {
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
      selectedDiets : selectedOptions
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

  //Handles changes done to the slider
  onSliderChange = (value) => {
    this.setState({
      radius : value,
    });
  }

  //Resets the filters.
  resetFilters()
  {
	this.setState({
      minOverall : 0,
      minReliability : 0,
      minVariety : 0,
      minService : 0,
      pricing: 0,
	  selectedDiets: this.state.userDiets
	})
  }


  //Renders the distance slider if we use it
  distanceSelector()  {
    let strings = new LocalizedStrings({
      en:{
        selectRadius: "Select search radius:",
      },
      fi: {
        selectRadius: "Valitse etsintä säde:",
      }
    });

    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);

    if(this.state.useUserLocation) {
      return(
        <div>
          <div><Label>{strings.selectRadius} {this.renderDistance()} </Label></div>
          <Slider
            min={100}
            max={20000}
            onChange={this.onSliderChange}
            value={this.state.radius}
          />
        </div>
      );
    }

    return;
  }

  //Prints distance
  renderDistance()
  {
    var km = this.state.radius / 1000;
    km = km.toFixed(2);
    return (km + "km");
  }

  renderDiets()
  {

    let strings = new LocalizedStrings({
      en:{
        loading: "Loading diets",
        error : "An error happened while fetching diets",
        selectPlaceholder:"Select diets...",
        noOptionsMessage:"No diets",
      },
      fi: {
        loading: "Ladataan ruokavalioita",
        error : "Virhe tapahtui ruokavalioita hakiessa",
        selectPlaceholder:"Valitse ruokavalioita...",
        noOptionsMessage:"Ei ruokavalioita",
      }
    });
    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);

    //If diets have been loaded, present them
    if(this.state.loadedDiets)
    {
      if(this.state.dietError == null)
      {
        //console.log("DEBUG: SearchBar.js renderDiets()")
        //console.log(this.state.diets)
        return (
          <Select
            defaultValue={ this.state.defaultValues }
            isMulti
            name="filtersDrop"
            options={ this.state.diets }
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={this.handleFilterChange}
            placeholder={strings.selectPlaceholder}
            noOptionsMessage={() => {return strings.noOptionsMessage}}
          />
        );
      }
      else
      {
        //console.log("DEBUG: SearchBar.js renderDiets()")
        //console.log(this.state.dietError)
        return (
          <div>
            {strings.error}
          </div>
        );
      }
    }

    //Else, present loading thingy
    return (
      <div>
        {strings.loading}
      </div>
    );

  }

  render() {
    let strings = new LocalizedStrings({
      en:{
        search:"Search in city...",
        useMyLocation: "Use my location when finding restaurants.",
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
        selectRadius: "Select search radius:",
		resetFilters: "Reset filters"
      },
      fi: {
        search:"Hae kaupungista...",
        useMyLocation: "Käytä sijaintiani ravintoloiden etsimisessä.",
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
        selectRadius: "Valitse etsintä säde:",
		resetFilters: "Tyhjennä hakuehdot"
      }
    });
    const language = this.props.language == null ? 'fi' : this.props.language;
    strings.setLanguage(language);

    const ThemedModalContainer = AppImports.containers.ThemedModalContainer;
    if(this.state.redirectUser) {
      //console.log("DEUBG: Searchbar.js render()")
      //console.log(this.searchUrl());
      return (<Redirect to={this.searchUrl()} />);
    }
    else {

      return (
        <div className="searchDiv">
          <form id="search-form" className="search" onSubmit={this.login}>

            <InputGroup>
              <Input type="text" value={this.state.keywords} onChange={this.handleKeywordChange} className="round" placeholder={strings.search} aria-label={strings.search} disabled={this.state.searchFieldDisabled} autoFocus />
              <InputGroupAddon addonType="append">
              <button type="submit" className="searchBtn main-btn btn" onClick={this.doSearch}>
                  <FontAwesomeIcon icon="search" />
              </button>
              </InputGroupAddon>
            </InputGroup>

            <input type="checkbox" name="useLocation"
              onChange={this.toggleSearchField}
              checked={this.state.useUserLocation}
            />
            {strings.useMyLocation}
            {this.distanceSelector()}
            <br/>

            <button className="filterBtn main-btn btn" id="filter_popover" onClick={this.toggleModal} type="button" >{strings.filter}</button>

            <ThemedModalContainer isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBox">

              <ModalHeader>{strings.includeinsearch}</ModalHeader>

              <ModalBody className="filterBox">

                {strings.diets}
                {this.renderDiets()}

                <br />
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
				<button className="btn main-btn" onClick={this.resetFilters}> {strings.resetFilters} </button>
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
