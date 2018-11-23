import React from 'react';
import {
  Button,
  NavItem,
  NavLink,Modal, ModalHeader, ModalBody, ModalFooter,	Form,
  Label} from 'reactstrap';
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
      modalState: false,
      checkboxes:{
        first:false,
        second:false,
        third:true,
        fourth:false,
        fifth:false,
        sixth:false,
      },
    }
    this.toggleModal = this.toggleModal.bind(this);

  }

  RadiusChanged = event =>{
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
    this.props.ChangeRadius(event.target.value);
  }

  //Toggles modal
  toggleModal() {

    this.setState({
      modalState: !this.state.modalState
    });

    console.log("showModal: Toggling modal to " + this.state.modalState)
  }

  render() {
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        filter:"Filter",
        closeModal:"Close",
        includeinsearch:"Sisällytä hakuun:",
        selectRadius: "Select search radius:",
      },
      fi: {
        filter:"Rajaa",
        closeModal:"Sulje",
        includeinsearch:"Sisällytä hakuun:",
        selectRadius: "Valitse etsintä säde:",
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
            <form name="Select radius" onChange={this.RadiusChanged}>
              <div><Label>{strings.selectRadius}</Label></div>
              <input type="radio" name="group1" value="2000"  checked={this.state.checkboxes.first} /> 2 km <br/>
              <input type="radio" name="group1" value="5000"  checked={this.state.checkboxes.second} /> 5 km <br/>
              <input type="radio" name="group1" value="10000" checked={this.state.checkboxes.third} /> 10 km <br/>
              <input type="radio" name="group1" value="15000" checked={this.state.checkboxes.fourth} /> 15 km <br/>
              <input type="radio" name="group1" value="25000" checked={this.state.checkboxes.fifth} /> 25 km <br/>
              <input type="radio" name="group1" value="50000" checked={this.state.checkboxes.sixth} /> 50 km <br/>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}> {strings.closeModal} </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ModalFilterPage;
