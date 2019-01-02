import React from 'react';
import {
  ModalHeader, ModalBody, ModalFooter,
  Label} from 'reactstrap';
import ReactStars from 'react-stars';
import Select from 'react-select';

import '../../../styles/map.css';

import * as AppImports from  '../../app';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
/* Localization */
import LocalizedStrings from 'react-localization';
const MapApi = require('./MapGlobalFunctions');

class ModalFilterPage extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
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
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
    this.changeOverall = this.changeOverall.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeVariety = this.changeVariety.bind(this);
    this.changeService = this.changeService.bind(this);
    this.changePricing = this.changePricing.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {
    this.setState({
      options : this.getOptions(),
    });
  }

  handleCityChange = event => {
    this.setState({
      city:event.target.value,
    })
  }

  onSliderChange = (value) => {
    this.setState({
      radius : value,
    });
  }

  onDietsChanged = (selectedOptions) => {
    console.log(selectedOptions)
    this.setState({
      diets : selectedOptions,
    });
  }

  clearFilters(){
    this.setState({
      radius : 1000,
      minOverall : 0,
      minReliability : 0,
      minVariety : 0,
      minService : 0,
      pricing: 0,
      city: "",
      diets: [],
    });
  }

  saveFilters(){
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
      }
    })
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
    if(this.state.modalState){
      this.setState({
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
    this.setState({
      modalState: !this.state.modalState
    });

    console.log("showModal: Toggling modal to " + this.state.modalState)
  }

  toggleAdvancedSearch(){
    this.setState({advancedSearchOpen:!this.state.advancedSearchOpen});
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

  //This gets the options for the selection.
  getOptions() {
    //TODO: Get options from backend.
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

    var advancedSearchBtnText = strings.advancedSearchOpenBtn
    if(this.state.advancedSearchOpen){
      advancedSearchBtnText = strings.advancedSearchCloseBtn
    }

    return(
      <div className="modal-filter-button">
        <button className="filterBtn btn main-btn" id="filter_popover" onClick={this.toggleModal} type="button">{strings.filter}</button>
        <ThemedModalContainer isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBox">
          <ModalHeader>{strings.includeinsearch}</ModalHeader>
          <ModalBody className="filterBox">
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
                autoFocus />
            </div>
            <div>
              <div className="Location-Question-Answere-Box">
                <input type="checkbox" name="useLocation"
                onChange={() => this.setState({useUserLocation: !this.state.useUserLocation})}
                checked={this.state.useUserLocation}/> {strings.doYouWantToUseLocationInSearch}<br/>
              </div>
            <div>
              <div><Label>{strings.selectRadius} {MapApi.distanceFormatter(this.state.radius)}</Label></div>
              <Slider
                min={1000}
                max={20000}
                onChange={this.onSliderChange}
                value={this.state.radius}
              />
            </div>
            <div className="diets-filters-box">
              {strings.diets}
              <Select
                defaultValue={ this.state.defaultValues }
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
              className="btn main-btn"
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
