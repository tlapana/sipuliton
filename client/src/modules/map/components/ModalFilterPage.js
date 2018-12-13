import React from 'react';
import {
  Button,
  NavItem,
  NavLink,Modal, ModalHeader, ModalBody, ModalFooter,	Form,
  Label} from 'reactstrap';
import ReactStars from 'react-stars';
import styles from '../../../styles/landingpage.css';
import '../../../styles/map.css';
/* Router imports */
import { Link } from 'react-router-dom';

import * as AppImports from  '../../app';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
/* Localization */
import LocalizedStrings from 'react-localization';

function distanceFormatter(v) {
  v = v/1000;
  v = v.toFixed(2);
  return `${v} km`;
}

class ModalFilterPage extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      modalState: this.props.showFilterBoxAtStart,
      useUserLocation:false,
      userHasAnswered:false,
      radius : this.props.filters.radius,
      minOverall : this.props.filters.minOverall,
      minReliability : this.props.filters.minReliability,
      minVariety : this.props.filters.minVariety,
      minService : this.props.filters.minService,
      pricing: this.props.filters.pricing,
      city: this.props.filters.city,
      originalStage: {
        city: this.props.filters.city,
        radius : this.props.filters.radius,
        minOverall : this.props.filters.minOverall,
        minReliability : this.props.filters.minReliability,
        minVariety : this.props.filters.minVariety,
        minService : this.props.filters.minService,
        pricing: this.props.filters.pricing,
      }
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.changeOverall = this.changeOverall.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeVariety = this.changeVariety.bind(this);
    this.changeService = this.changeService.bind(this);
    this.changePricing = this.changePricing.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
    this.answerNo = this.answerNo.bind(this);
    this.answerYes = this.answerYes.bind(this);
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

  answerNo(){
    this.setState({
      useUserLocation:false,
      userHasAnswered:true,
    })
  }

  answerYes(){
      this.setState({
        useUserLocation:true,
        userHasAnswered:true,
      })
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
        city: this.state.originalStage.city
      })
    }
    this.setState({
      modalState: !this.state.modalState
    });

    console.log("showModal: Toggling modal to " + this.state.modalState)
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
        filter:"Filter",
        doYouWantToUseLocationInSearch:"Use my location when finding restaurants.",
        yes:"Yes",
        no:"No",
        enterCity:"Enter city...",
        cityWhereToFindRestaurants:"City where we search restaurants"
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
        filter:"Rajaa",
        doYouWantToUseLocationInSearch:"Käytä sijaintiani ravintoloiden etsimisessä.",
        yes:"Kyllä",
        no:"En",
        enterCity:"Syötä kaupunki...",
        cityWhereToFindRestaurants:"Kaupunki, josta ravintoloita etsitään"
      }
    });

    if(typeof this.props.language !== 'undefined'){
      strings.setLanguage(this.props.language);
    }
    else{
      strings.setLanguage('fi');
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
              <div><Label>{strings.selectRadius} {distanceFormatter(this.state.radius)}</Label></div>
              <Slider
                min={1000}
                max={20000}
                onChange={this.onSliderChange}
                value={this.state.radius}
              />
            </div>
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
            </div>
          </ModalBody>
          <ModalFooter>
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
