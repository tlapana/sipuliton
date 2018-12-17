/*
  This file contains the landing page. Or at least the basic shape.
  Functionalities are spread into separate components

*/

import React from 'react';
import ReactStars from 'react-stars'
import { Button } from 'reactstrap';
import Select from 'react-select';
import '../../../styles/writereview.css';

export default class WriteReview extends React.Component {
  
  constructor(props, context) {
    
    super(props);
    
    //Bind the functions
    this.setState = this.setState.bind(this);
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
    
    this.state = {
      id : this.props.restaurantId,
      error: null,
      loadingData: true,
      loadingOptions: true,
      submitingReview: false,
      reviewSubmitted: false,
      restaurant : null,
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
    this.getRestaurant(this.state.id); 
    this.getOptions();
  }
  
  getRestaurant(id)
  {
    //For testing purposes use hard coded datas
    const all_restaurants = [
      { id: 1, name: 'Kallen Kala', street_address : "Kalastajankylä 1" },
      { id: 2, name: 'Vegaani Pupula', street_address : "Puputie 2" },
      { id: 3, name: 'Lihameisterin Grillaamo', street_address : "Grillaajankat 3" },
      { id: 4, name: 'Gennan Geneerinen', street_address : "Geenitie 4" },
      { id: 5, name: 'Iso 5', street_address : "Bigstreet 5" }
    ];
    
    var target = null;
    
    for(var i = 0; i < all_restaurants.length; i++) {
      
      var r = all_restaurants[i];
      
      if( r.id == id)
      {
        target = r;
      }
      
    }
      
    console.log("Checking that restaurant " + id + " exists");
    
    //If we found the target, set it as the selected restaurant. Otherwise, give error
    if(target != null) {  
      console.log("Restaurant exists")
      this.setState({
        restaurant : target,
        loadingData : false
      });
    }
    else {    
      console.log("Restaurant doesn't exists")  
      this.setState({
        error : "Ravintolaa ei ole",
        loadingData : false
      });
      
    }    
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
    if(this.state.submitingReview){
      return (
        'Lähetetään...'
      );
    }
    else {
      return (
        <button type="submit" className="submitBtn" onClick={this.submitReview}>
              Lähetä
        </button> 
      );
    }
  }
  
  //Function to print the review form
  reviewForm() {
    return (
      <div className="reviewDiv">
        <form className="review">
          <h3 className="restaurantName"> {this.state.restaurant.name} </h3>
          
          <input className='title' type="text" value={this.state.title} onChange={this.changeTitle} placeholder={'Otsikko...'} /> <br/>
          <textarea className='reviewTextArea' value={this.state.reviewText} onChange={this.changeReview}  placeholder={'Kirjoita arvostely tähän...'} />
              
          Ruokavaliot:
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
            
          Erikoisruokavalion luotettavuus: 
          <ReactStars
            value = {this.state.reliability}
            count = {5}
            size = {24}
            onChange = {this.changeReliability}
          />
          <br />  
            
          Valinnanvara: 
          <ReactStars
            value = {this.state.choice}
            count = {5}
            size = {24}
            onChange = {this.changeChoice}
          />
          <br />
            
          Palvelu ja laatu: 
          <ReactStars
            value = {this.state.quality}
            count = {5}
            size = {24}
            onChange = {this.changeQuality}
          />
          <br />
           
          Hintataso: 
          <ReactStars
            value = {this.state.cost}
            count = {3}
            size = {24}
            char = {'€'}
            half = {false}
            onChange = {this.changeCost}
          />
          <br />
            
          {this.reviewButton()}  
             
        </form>        
      </div>
    );
  }
  
  render() {
    
    //Localization here
    
    
    
    if(this.state.loadingData || this.state.loadingOptions) {
      return (  
      <div className="reviewDiv">  
        Ladataan tietoja...
      </div>
      );
    }
    else {
      if(this.state.error != null) {
        return (  
        <div className="reviewDiv">  
          Tapahtui virhe: {this.state.error}
        </div>
        );      
      }
      else if(this.state.reviewSubmitted) {
        return (
          <div className="reviewDiv">
            <h3> Arvostelu lähetetty! </h3>
          </div>
        );
      }
      else {
        return ( this.reviewForm() );
      }
    }
    
    
  }
  
}
