import React, { } from 'react';
import { browserHistory, Router, Route } from 'react-router';
import { Link, withRouter } from "react-router-dom";
import ReactStars from 'react-stars'
import {  Redirect } from 'react-router-dom';
import config from '../../../config';
import { API } from "aws-amplify";

import { Button, Container, Row, Col } from 'reactstrap';

class ReviewData extends React.Component {
      constructor(props) {
            super(props);

            var item=this.props.data.title;
              this.state = {
                title:this.props.data.title,
                freetext:  this.props.data.free_text,
                name:  this.props.data.name,
                posted:  this.props.data.posted,
                overall: this.props.data.rating_overall,
                pricing: this.props.data.pricing,
                RatingServiceAndQuality:this.props.data.rating_service_and_quality,
                rating_variety: this.props.data.rating_variety,
                id:this.props.data.review_id

               }
      }
     send()   {
      localStorage.setItem('myCat', "" + JSON.stringify(this.props.data));
       window.location="/fi/myReviewEdit"

     }
      render() {
            return (
                    <div >
                       <fieldset>
                              <Row>
                                    <Col xs="2">
                                        name
                                    </Col>
                                    <Col xs="4">
                                   {this.state.name}
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="2">
                                        title
                                    </Col>
                                    <Col xs="4">
                                             {this.state.title}
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs="2">
                                        freetext
                                    </Col>
                                    <Col xs="4">
                                             {this.state.freetext}
                                    </Col>
                              </Row>
                              <Row>
                                    <Col xs="2">
                                        Posted
                                    </Col>
                                    <Col xs="4">
                                             {this.state.posted}
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="2">
                                        Overall Rating
                                    </Col>
                                    <Col xs="4">
                                             <ReactStars value = {this.state.overall}  count = {5} size = {24} />
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="2">
                                        Pricing
                                    </Col>
                                    <Col xs="4">
                                             <ReactStars value = {this.state.pricing}  count = {3} size = {24} />
                                    </Col>
                              </Row>


                              <Row>
                                    <Col xs="2">
                                        Rating service and quality
                                    </Col>
                                    <Col xs="4">
                                             <ReactStars value = {this.state.RatingServiceAndQuality}  count = {5} size = {24} />
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="2">
                                        Rating variety
                                    </Col>
                                    <Col xs="4">
                                             <ReactStars value = {this.state.rating_variety}  count = {5} size = {24} />
                                    </Col>
                              </Row>



                              <Button   onClick={()=>{this.send()}} >Edit</Button><Button onClick={()=>{this.send()}}>Delete</Button>




                     </fieldset>
                    <br/>
                    </div>
                  )
          }
  };

class Review extends React.Component {

      changed() {
            console.log(2)
      }

     t1=this;
      constructor(props) {

        super(props);

          this.state = {
                array:[],
                  mode: true,
                  title: '',
                  name: '',
                  posted: '',
                  rating_overall: 0,
                  freetext: '',
                  pricing: 0,
                  rating_variety: 0,
                  rating_service_and_quality: 0,
                  edit: false
            }

      }
      left() { alert('vasen'); }
      rigth() { alert('rigth'); }
      deleteItem() { 
            //let init = { queryStringParameters: {} };
            //API.get('api', '/ownReviews/delete', init)
            //fetch(config.backendAPIPaths.BASE + '/ownReviews/delete');
      }
      init(statusvalue)  {
            var t = this;
            let init = { queryStringParameters: { status: statusvalue } };
            //fetch(config.backendAPIPaths.BASE + '/ownReviews?status=' + statusvalue).then((response) => response.json())
            API.get('api', '/ownReviews', init)
                  .then((responseJson) => {
                             var array1=[];
                             for(var item in responseJson.reviews)  {
                               array1.push(<ReviewData data={responseJson.reviews[item]} key="1"/>);
                             }
                             t.setState({array : array1});
                        t.setState({ edit: false });

                  })
                  .catch((error) => {
                        alert("review=" + error);
                        console.error(error);
                  });

      }
      componentWillMount() {

           this.init(0);
      }
      save() {

            var text = document.getElementById("freetext").value;
            var title = document.getElementById("title").value;
            var pricing = document.getElementById("pricing1").value;
            var rating_service_and_quality = document.getElementById("rating_service_and_quality").value;

            var rating_overall = document.getElementById("overall").value;

            var rating_variety = document.getElementById("rating_variety").value;
            let init = { 
                  queryStringParameters: {
                        status: 0,
                        text: text,
                        title: title,
                        rating_overall: rating_overall,
                        rating_variety: rating_variety,
                        pricing: pricing,
                        rating_service_and_quality: rating_service_and_quality,
                  } 
            };
            API.get('api', '/ownReviews/edit', init)
                  .then(response => alert('jes'));
      }

      changedvalue()  {

          this.init(document.getElementById("status").value);
      }

      render() {

            const ratingChanged = (newRating) => {
                  console.log(newRating)

            }

            if (this.state.edit === false) {

                  return (<div>
                        <h1>MyReviews </h1>


                        <input type="button" value="Vasen" onClick={() => { this.rigth() }} />
                        <input type="button" value="oikea" onClick={() => { this.rigth() }} />

                        <select id="status"  onChange={()=>{this.changedvalue()}}>
                        <option value="0">Status 0</option>
                        <option value="1">Status 1</option>
                        <option value="2">Status 2</option>
                         </select>

                        <div style={{"width":"400px","overflow": "scroll","height": "300px"}}>

                        {this.state.array}
                       </div>




                  </div>);
            }

            return (
                  <h1>MyReviews8</h1>
            )
      }

}
export default Review;
