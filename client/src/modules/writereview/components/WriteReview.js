/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import ReactStars from 'react-stars'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import '../../../styles/writereview.css';

export default class WriteReview extends React.Component {
  
  constructor(props, context) {
    
    super(props);
    
    //Bind the functions
    this.setState = this.setState.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.getRestaurant = this.getRestaurant.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeReview = this.changeReview.bind(this);
    this.changeQuality = this.changeQuality.bind(this);
    this.changeReliability = this.changeReliability.bind(this);
    this.changeChoice = this.changeChoice.bind(this);
    this.changeCost = this.changeCost.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.reviewForm = this.reviewForm.bind(this);
    this.submitReview = this.submitReview.bind(this);
  
    const { match: { params } } = this.props;
    
    this.state = {
      id : params.restaurantID,
      error: null,
      loadingData: true,
      loadingOptions: true,
      submitingReview: false,
      reviewSubmitted: false,
      showForm: false,
      restaurant : this.props.restaurant,
      title : '',
      reviewText : '',
      options : [],
      selectedFilters : [],
      reliability : 0,
      choice : 0,
      quality : 0,
      cost : 0 
    };
  }  
  
  //Actios to be caried upon mounting
  componentDidMount() {
    this._isMounted = true;    
    this.getOptions();
  }
  
  toggleForm() {
    this.setState({
      showForm : !this.state.showForm
    });
  }
  
  //Gets all the filtering options
  getOptions() {

    const options = [
      { value: 'onions', label: 'Allergia/Sipuli' },
      { value: 'tomato', label: 'Allergia/Tomaatti' },
      { value: 'nuts', label: 'Allergia/Pähkinä' },
      { value: 'lactose', label: 'Laktoositon ruokavalio' },
      { value: 'coeliac ', label: 'Keliakia' }
    ];

    this.setState({
      options : options,
      loadingOptions : false
    });
   
  }
  
  
  
  //Following four just change the values
  changeTitle(event) {
    this.setState({
      title : event.target.value
    });
  }
  
  changeReview(event) {
    this.setState({
      reviewText : event.target.value
    });
  }
  
  
  changeQuality(newRating, name) {    
    this.setState({
      quality : newRating
    });
  }
  
  changeReliability(newRating, name) {    
    this.setState({
      reliability : newRating
    });
  }
  
  changeChoice(newRating, name) {    
    this.setState({
      choice : newRating
    });
  }
  
  changeCost(newRating, name) {    
    this.setState({
      cost : newRating
    });
  }
  
  //Used to acknowledge change and store new values
  changeFilter(selectedOptions) {
    this.setState({
      selectedFilters : selectedOptions
    });
  }
  
  //For submitting the review
  submitReview  = event =>{
    
    event.preventDefault();
    console.log("Submiting review");
    this.setState({
      submitingReview : true
    });
    
    //Close form
    toggleForm();
    
    //Generate JSON
    var obj = new Object();
    
    obj.id = this.state.id;
    obj.title = this.state.title;
    obj.reviewText = this.state.reviewText;
    obj.reliability = this.state.reliability;
    obj.choice = this.state.choice;
    obj.quality = this.state.quality;
    obj.cost = this.state.cost;
    obj.selectedFilters = this.state.selectedFilters;
    
    var jsonString = JSON.stringify(obj);
    
    
    console.log("JSON Object");
    console.log(obj);
    console.log("As string");
    console.log(jsonString);
    
    this.setState({
      reviewSubmitted : true
    });
  }
  
  //Review button functionality
  reviewButton() {
    
    let strings = new LocalizedStrings({
      en:{
        message : "Send"
      },
      fi: {
        message : "Lähetä"
      }
    });
    
    if(this.state.submitingReview){
      return (
        'Lähetetään...'
      );
    }
    else {
      return (
        <button type="submit" className="submitBtn" onClick={this.submitReview}>
          {strings.message}
        </button> 
      );
    }
  }  
  render() {
    
    //Localization here
    let strings = new LocalizedStrings({
      en:{
        modalTitle : "Rate restaurant",
        titlePlaceholder : "Title",
        textPlaceholder : "Write review here"
        diets : "Diet",
        reliability : "Diet reliability",
        variety : "Variety",
        service : "Service and quality",
        pricing : "Pricing",
        cancel : "Cancel",        
        search:"Search..."
      },
      fi: {
        modalTitle : "Arvostele ravinstola",
        diets: "Ruokavaliot",
        titlePlaceholder : "Otsikko",
        textPlaceholder : "Kirjoita arvostelu tähän"
        diets : "Ruokavaliot",
        reliability : "Erikoisruokavalion luotettavuus",
        variety : "Valinnanvara",
        service : "Palvelu ja laatu",
        pricing : "Hintataso",
        cancel : "Peruuta",
        search:"Hae..."
      }
    });
    
    if(typeof this.props.language !== 'undefined'){
      strings.setLanguage(this.props.language);
    }
    else{
      strings.setLanguage('fi');
    }
    return ( 
      <button className="filterBtn" onClick={this.toggleForm} type="button" >{strings.filter}</button>  
      
      <Modal isOpen={this.state.modalState} toggle={this.showForm}>
        <ModalHeader> {strings.modalTitle} </ModalHeader>
        <ModalBody>
          <div className="reviewDiv">
            <form className="review">
              <h3 className="restaurantName"> {this.state.restaurant.name} </h3>
              
              <input className='title' type="text" value={this.state.title} onChange={this.changeTitle} placeholder={strings.titlePlaceholder} /> <br/>
              <textarea className='reviewTextArea' value={this.state.reviewText} onChange={this.changeReview}  placeholder={strings.textPlaceholder} />
                  
              {strings.pricing}:
              <Select
                defaultValue={ this.state.defaultValues }
                isMulti
                name="filtersDrop"
                options={ this.state.options }
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={this.changeFilter}
              />
              <br />      
                
              {strings.reliability}: 
              <ReactStars
                value = {this.state.reliability}
                count = {5}
                size = {24}
                onChange = {this.changeReliability}
              />
              <br />  
               
              {strings.variety}:
              <ReactStars
                value = {this.state.choice}
                count = {5}
                size = {24}
                onChange = {this.changeChoice}
              />
              <br />
                
              {strings.service}:
              <ReactStars
                value = {this.state.quality}
                count = {5}
                size = {24}
                onChange = {this.changeQuality}
              />
              <br />
               
              {strings.pricing}: 
              <ReactStars
                value = {this.state.cost}
                count = {3}
                size = {24}
                char = {'€'}
                half = {false}
                onChange = {this.changeCost}
              />
              <br />
              
            </form>        
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submitReview}> {strings.submit} </Button> 
          <Button color="secondary" onClick={this.toggleModal}> {strings.cancel} </Button> 
        </ModalFooter>
      </Modal>
    );
    }
    
  }
  
}
