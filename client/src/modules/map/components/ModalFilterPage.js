//This component is modal filter page for filtering restaurants.

//Component imports.
import React from 'react';
import ReactLoading from 'react-loading';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label
} from 'reactstrap';
import ReactStars from 'react-stars';
import Select from 'react-select';
import * as AppImports from  '../../app';
import Slider from 'rc-slider';
import { API } from "aws-amplify";

//Style imports.
import 'rc-slider/assets/index.css';
import '../../../styles/map.css';

// Configuration imports.
import Config from '../../../config.js';

/* Localization */
import LocalizedStrings from 'react-localization';

//Map global api.
const MapApi = require('./MapGlobalFunctions');

class ModalFilterPage extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    //Initialize filters
    this.state = {
      disabled: false,
      modalState: this.props.showFilterBoxAtStart,
      radius : this.props.filters.radius,
      minOverall : this.props.filters.minOverall,
      minReliability : this.props.filters.minReliability,
      minVariety : this.props.filters.minVariety,
      minService : this.props.filters.minService,
      pricing: this.props.filters.pricing,
      city: this.props.filters.city,
      diets: this.props.filters.diets,
      defaultValues: this.props.filters.diets,
      options: [],
      advancedSearchOpen: false,
      loading: false,
      originalStage: {
        city: this.props.filters.city,
        radius : this.props.filters.radius,
        minOverall : this.props.filters.minOverall,
        minReliability : this.props.filters.minReliability,
        minVariety : this.props.filters.minVariety,
        minService : this.props.filters.minService,
        pricing: this.props.filters.pricing,
        diets: this.props.filters.diets,
        defaultValues: this.props.filters.diets,
      }
    }

    //Function bindings.
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
    this.changeOverall = this.changeOverall.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeVariety = this.changeVariety.bind(this);
    this.changeService = this.changeService.bind(this);
    this.changePricing = this.changePricing.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.handleUseLocation = this.handleUseLocation.bind(this);
  }

  componentDidMount() {
    this.setState({loading:true});

    //Get diet options.
    this.getOptions();

    // Get default diets.
    this.getDefaultValues();

    // render page
    this.render();
  }

  //Handle search city change.
  handleCityChange = event => {
    this.setState({
      city:event.target.value,
    })
  }

  //Handle distance slider change.
  onSliderChange = (value) => {
    this.setState({
      radius : value,
    });
  }

  //Handle diets changes.
  onDietsChanged = (selectedOptions) => {
    //Debug logging
    //console.log(selectedOptions)
    this.setState({
      diets : selectedOptions,
    });
  }

  //Clears filters to basic values.
  clearFilters(){
    this.setState({
      radius : 1000,
      minOverall : 0,
      minReliability : 0,
      minVariety : 0,
      minService : 0,
      pricing: 0,
      city: "",
      diets: this.state.defaultValues,
    });
    //console.log(this.state.defaultValues)
    this.render();
  }

  //Saves filters when modal page is closed.
  saveFilters(){
    //Initialize selected filters to original stage to show them next time.
    this.setState({
      modalState: !this.state.modalState,
      originalStage: {
        radius : this.state.radius,
        minOverall : this.state.minOverall,
        minReliability : this.state.minReliability,
        minVariety : this.state.minVariety,
        minService : this.state.minService,
        pricing: this.state.pricing,
        city: this.state.city,
        diets: this.state.diets,
        defaultValues: this.state.defaultValues
      }
    })

    //logging for debugging
    //console.log(searchDiets)

    //call filters changed method to fetch new restaurants.
    this.props.FiltersChanged(
      this.state.radius,
      this.state.minOverall,
      this.state.minReliability,
      this.state.minVariety,
      this.state.minService,
      this.state.pricing,
      this.state.city,
      this.state.useUserLocation,
      this.state.diets,
    );
  }

  //Toggles modal
  toggleModal() {
    if(!this.state.modalState){
      this.setState({
        modalState: !this.state.modalState,
        radius : this.state.originalStage.radius,
        minOverall : this.state.originalStage.minOverall,
        minReliability : this.state.originalStage.minReliability,
        minVariety : this.state.originalStage.minVariety,
        minService : this.state.originalStage.minService,
        pricing: this.state.originalStage.pricing,
        city: this.state.originalStage.city,
        diets: this.state.originalStage.diets,
        defaultValues: this.state.originalStage.defaultValues,
      })
    }
    else{
      this.setState({
        modalState: !this.state.modalState,
        originalStage: {
          radius : this.state.radius,
          minOverall : this.state.minOverall,
          minReliability : this.state.minReliability,
          minVariety : this.state.minVariety,
          minService : this.state.minService,
          pricing: this.state.pricing,
          city: this.state.city,
          diets: this.state.diets,
          defaultValues: this.state.defaultValues
        }
      })
    }

    //console logging for debug
    //console.log("showModal: Toggling modal to " + this.state.modalState)
  }

  //Opens and closes advanced search
  toggleAdvancedSearch(){
    if(this.state.advancedSearchOpen)
    {
      this.setState({
        advancedSearchOpen:!this.state.advancedSearchOpen,
        minOverall : 0,
        minReliability : 0,
        minVariety : 0,
        minService : 0,
        pricing: 0,
        originalStage: {
          minOverall : this.state.minOverall,
          minReliability : this.state.minReliability,
          minVariety : this.state.minVariety,
          minService : this.state.minService,
          pricing: this.state.pricing,
        },
      })
    }
    else{
      this.setState({
        advancedSearchOpen:!this.state.advancedSearchOpen,
        minOverall : this.state.originalStage.minOverall,
        minReliability : this.state.originalStage.minReliability,
        minVariety : this.state.originalStage.minVariety,
        minService : this.state.originalStage.minService,
        pricing: this.state.originalStage.pricing,
      })
    }
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

  handleUseLocation(event)
  {
    this.setState({
        useUserLocation: !this.state.useUserLocation,
        disabled: !this.state.disabled,
      })
  }

  //This gets the default options for the selection.
  getOptions() {
    //Console log for debugging.
    //console.log("Getting the options: ");
    var url = Config.backendAPIPaths.BASE+'/diet/all';
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          //Console log for debugging.
          //console.log("Sending results");
          //console.log(result);
          var options = [];
          //Send data via props
          result.forEach(function(element) {
            options.push({value:element.global_diet_id, label:element.name});
          });
          this.setState({
            options : options,
            loadedOptions : true
          });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("DEBUG: ComponentsDidMount error");
        console.log(error);
      }
    );

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
          var dietOptions = this.state.options;
          result.own_diets.forEach(function(userDiet) {
            dietOptions.forEach(function(dietOption) {
              if(userDiet.global_diet_id === dietOption.value)
              {
                defValues.push(dietOption);
              }
            });
          })
          //console.log(defValues);
          this.setState({
            diets: defValues,
            defaultValues : defValues,
            loadedOptions : true
          });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.log("DEBUG: ComponentsDidMount error");
        console.log(error);
      }
    ).then(() => this.setState({loading:false}));
  }

  render() {
    const ThemedModalContainer = AppImports.containers.ThemedModalContainer;
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        filter:"Filter",
        closeModal:"Close",
        includeinsearch:"Sisällytä hakuun:",
        selectRadius: "Select search radius:",
        overall:"Overall rating",
        reliability:"Menu reliability",
        service:"Service & Food",
        variety:"Menu variety",
        pricing:"Pricing",
        doYouWantToUseLocationInSearch:"Use my location when finding restaurants.",
        yes:"Yes",
        no:"No",
        enterCity:"Enter city...",
        cityWhereToFindRestaurants:"City where we search restaurants",
        diets:"Diets/Allergies",
        selectPlaceholder:"Select diets...",
        noOptionsMessage:"No diets",
        clear:"Clear filters",
        advancedSearchOpenBtn:"Open advanced search",
        advancedSearchCloseBtn:"Close advanced search",
      },
      fi: {
        filter:"Rajaa",
        closeModal:"Sulje",
        includeinsearch:"Sisällytä hakuun:",
        selectRadius: "Valitse etsintä säde:",
        overall:"Keskiarvo",
        reliability:"Ruokavalion luotettavuus",
        service:"Ruoka ja palvelu",
        variety:"Ruokalajien laajuus",
        pricing:"Hintaluokka",
        doYouWantToUseLocationInSearch:"Käytä sijaintiani ravintoloiden etsimisessä.",
        yes:"Kyllä",
        no:"En",
        enterCity:"Syötä kaupunki...",
        cityWhereToFindRestaurants:"Kaupunki, josta ravintoloita etsitään",
        diets:"Dietit/Allergiat",
        selectPlaceholder:"Valitse ruokavalioita...",
        noOptionsMessage:"Ei ruokavalioita",
        clear:"Poista rajaukset",
        advancedSearchOpenBtn:"Avaa laajennettu haku",
        advancedSearchCloseBtn:"Sulje laajennettu haku",
      }
    });

    if(typeof this.props.language !== 'undefined'){
      strings.setLanguage(this.props.language);
    }
    else{
      strings.setLanguage('fi');
    }

    //Open/Close advanced search button text selection.
    var advancedSearchBtnText = strings.advancedSearchOpenBtn
    if(this.state.advancedSearchOpen){
      advancedSearchBtnText = strings.advancedSearchCloseBtn
    }

    return(
      <div className="modal-filter-button">
        <button className="filterBtn btn main-btn" id="filter_popover" onClick={this.toggleModal} type="button">{strings.filter}</button>
        <ThemedModalContainer isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBoxMap">
          <ModalHeader>{strings.includeinsearch}</ModalHeader>
          <ModalBody className="filterBoxMap">
            {this.state.loading &&
              <div className="loading-container">
                <ReactLoading
                  type={'spinningBubbles'}
                  className="loadingSpinner loadingSpinner-map"
                />
              </div>
            }
            <div>
              <div>
                {strings.cityWhereToFindRestaurants}
              </div>
              <input
                type="text"
                value={this.state.city}
                onChange={this.handleCityChange}
                className="city-search-input form-control"
                placeholder={strings.enterCity}
                disabled = {(this.state.disabled)? "disabled" : ""}
                autoFocus />
            </div>
            <div>
              <div className="Location-Question-Answere-Box">
                <input type="checkbox" name="useLocation"
                onChange={this.handleUseLocation}
                value={this.state.useUserLocation}/> {strings.doYouWantToUseLocationInSearch}<br/>
              </div>
            <div>
              <div><Label>{strings.selectRadius} {MapApi.distanceFormatter(this.state.radius)}</Label></div>
              <Slider
                min={100}
                max={20000}
                step={0.1}
                onChange={this.onSliderChange}
                value={this.state.radius}
              />
            </div>
            <div className="diets-filters-box">
              {strings.diets}
              <Select
                value={this.state.diets}
                isMulti
                name="filtersDrop"
                options={ this.state.options }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={this.onDietsChanged}
                placeholder={strings.selectPlaceholder}
                noOptionsMessage={() => {return strings.noOptionsMessage}}
              />
            </div>
            <button
              className="btn main-btn advanced-filters-btn"
              onClick={this.toggleAdvancedSearch}
            >
              {advancedSearchBtnText}
            </button>
            {this.state.advancedSearchOpen &&
              <div className="rating-filters-box">
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
              </div>
            }
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn main-btn"
              onClick={this.clearFilters}
            >
              {strings.clear}
            </button>
            <button
              className="btn main-btn"
              onClick={this.saveFilters}
            >
              {strings.filter}
            </button>
            <button
              className="btn main-btn"
              onClick={this.toggleModal}
            >
              {strings.closeModal}
            </button>
          </ModalFooter>
        </ThemedModalContainer>
      </div>
    )
  }
}

export default ModalFilterPage;
