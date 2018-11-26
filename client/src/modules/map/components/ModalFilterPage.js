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

/* Localization */
import LocalizedStrings from 'react-localization';

class ModalFilterPage extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      modalState: true,
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
      useUserLocation:false,
      userHasAnswered:false,
      radius : this.props.filters.radius,
      minOverall : this.props.filters.minOverall,
      minReliability : this.props.filters.minReliability,
      minVariety : this.props.filters.minVariety,
      minService : this.props.filters.minService,
      pricing: this.props.filters.pricing,
      city: "",
      originalStage: {
        checkboxes:{
          first:false,
          second:false,
          third:true,
          fourth:false,
          fifth:false,
          sixth:false,
        },
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
    this.handleCityChange = this.handleCityChange.bind(this);
  }

  handleCityChange(){

  }

  RadiusChanged = event =>{
    this.setState({radius:event.target.value});
    if(event.target.value === "2000"){
      this.setState({
        checkboxes:{
              first:true,
              second:false,
              third:false,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "5000"){
      this.setState({
        checkboxes:{
              first:false,
              second:true,
              third:false,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "10000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:true,
              fourth:false,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "15000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:true,
              fifth:false,
              sixth:false,
            }})
    }
    if(event.target.value === "25000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:false,
              fifth:true,
              sixth:false,
            }})
    }
    if(event.target.value === "50000"){
      this.setState({
        checkboxes:{
              first:false,
              second:false,
              third:false,
              fourth:false,
              fifth:false,
              sixth:true,
            }})
    }
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
        checkboxes:this.state.checkboxes,
        radius : this.state.radius,
        minOverall : this.state.minOverall,
        minReliability : this.state.minReliability,
        minVariety : this.state.minVariety,
        minService : this.state.minService,
        pricing: this.state.pricing,
      }
    })
    this.props.FiltersChanged(
      this.state.radius,
      this.state.minOverall,
      this.state.minReliability,
      this.state.minVariety,
      this.state.minService,
      this.state.pricing,
    );
  }

  //Toggles modal
  toggleModal() {
    if(this.state.modalState){
      this.setState({
        checkboxes:this.state.originalStage.checkboxes,
        radius : this.state.originalStage.radius,
        minOverall : this.state.originalStage.minOverall,
        minReliability : this.state.originalStage.minReliability,
        minVariety : this.state.originalStage.minVariety,
        minService : this.state.originalStage.minService,
        pricing: this.state.originalStage.pricing,
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
        doYouWantToUseLocationInSearch:"Do you want to search restaurants based on your location?",
        yes:"Yes",
        no:"No",
        enterCity:"Enter city..."
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
        doYouWantToUseLocationInSearch:"Haluatko etsiä ravintoloita, jotka ovat lähellä sinua?",
        yes:"Kyllä",
        no:"En",
        enterCity:"Syötä kaupunki..."
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
        <Button className="filterBtn" id="filter_popover" onClick={this.toggleModal} type="button">{strings.filter}</Button>
        <Modal isOpen={this.state.modalState} toggle={this.toggleModal} className="filterBox">
          <ModalHeader>{strings.includeinsearch}</ModalHeader>
          <ModalBody className="filterBox">
            {this.props.geolocationEnabled &&
              <div>
                <div>{strings.doYouWantToUseLocationInSearch}</div>
                <Button color="primary" className="Modal-Filter-Page-Btn" onClick={this.answerYes}>{strings.yes}</Button>
                <Button color="primary" className="Modal-Filter-Page-Btn" onClick={this.answerNo}>{strings.no}</Button>
                {this.state.useUserLocation &&
                  <form name="Select radius" onChange={this.RadiusChanged}>
                    <div><Label>{strings.selectRadius}</Label></div>
                    <input type="radio" name="group1" value="2000"  checked={this.state.checkboxes.first} /> 2 km <br/>
                    <input type="radio" name="group1" value="5000"  checked={this.state.checkboxes.second} /> 5 km <br/>
                    <input type="radio" name="group1" value="10000" checked={this.state.checkboxes.third} /> 10 km <br/>
                    <input type="radio" name="group1" value="15000" checked={this.state.checkboxes.fourth} /> 15 km <br/>
                    <input type="radio" name="group1" value="25000" checked={this.state.checkboxes.fifth} /> 25 km <br/>
                    <input type="radio" name="group1" value="50000" checked={this.state.checkboxes.sixth} /> 50 km <br/>
                  </form>
                }
                {!this.state.useUserLocation &&
                  <div>
                    {this.state.userHasAnswered &&
                      <div>
                        <input type="text" value={this.state.city} onChange={this.handleCityChange} className="round" placeholder={strings.enterCity} autoFocus />
                      </div>
                    }
                  </div>
                }

              </div>
            }
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
            <Button color="primary" onClick={this.saveFilters}> {strings.filter} </Button>
            <Button color="primary" onClick={this.toggleModal}> {strings.closeModal} </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ModalFilterPage;
