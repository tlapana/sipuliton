import React, { } from 'react';
import { browserHistory, Router, Route } from 'react-router';
import { Link, withRouter } from "react-router-dom";
import ReactStars from 'react-stars'
import {  Redirect } from 'react-router-dom';
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
      localStorage.setItem('info', "" + JSON.stringify(this.props.data));
       window.location="http://localhost:3001/fi/myReviewEdit"

     }
     deleterow(term)  {
         fetch('http://127.0.0.1:3000/ownReviews/delete?review_id=' + term)

         .then(ans => {
    if(ans.ok) {
      alert('ok')
      window.location.reload(); 
    } else {
          alert('fail')

    }
  })
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



                              <Button   onClick={()=>{this.send()}} >Edit</Button><Button onClick={()=>{this.deleterow( this.state.id)}}>Delete</Button>


 

                     </fieldset>
                    <br/>
                    </div>
                  )
          }
  };

class Review extends React.Component {
     page=0;
     limit=2;
      changed() {
            console.log(2)
      }
     send()  {
   
   
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
      left() { 
       if(this.page>0) 
         { 
             this.page--;
          }

            this.init(0);     
         }
      rigth() 
         { 
            this.page++; 

           this.init(0);
            
        }
      deleteItem() { fetch('http://127.0.0.1:3000/ownReviews/delete') }
      init(statusvalue)  {
            var t = this;
            fetch('http://127.0.0.1:3000/ownReviews?status=' + statusvalue + '&limit=' + this.limit +'&offset='+this.page*this.limit).then((response) => response.json())
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
            var url = 'http://127.0.0.1:3000/ownReviews/edit?status=0&text=' + text;
            url += "&title=" + title;
            url += "&rating_overall=" + rating_overall;
            url += "&rating_variety=" + rating_variety;
            url += "&pricing=" + pricing;
            url += "&rating_service_and_quality=" + rating_service_and_quality;




            fetch(url)
                  .then(response => alert('jes'));
      }

      changedvalue()  {
      
          this.init(document.getElementById("status").value);
      }
      changeLimit()  {
          this.limit=document.getElementById("limit").value;
          this.init(document.getElementById("status").value);
      }

      render() {

            const ratingChanged = (newRating) => {
                  console.log(newRating)

            }

            if (this.state.edit === false) {

                  return (<div>
                        <h1>MyReviews </h1>


                        <input type="button" value="<<" onClick={() => { this.left() }} />
                        <input type="button" value=">>" onClick={() => { this.rigth() }} />

                        <select id="status"  onChange={()=>{this.changedvalue()}}>
                        <option value="0">Status 0</option>
                        <option value="1">Status 1</option>
                        <option value="2">Status 2</option>
                         </select>
                        <label>Arvosteluja sivulla</label>
                        <select id="limit" onChange={()=>{this.changeLimit()}}>
                         <option value="2">2</option>
                         <option value="4">4</option>

                        </select>
                          
                        <div style={{"width":"400px","overflow": "scroll","height": "300px"}}>

                        {this.state.array}
                       </div>




                  </div>);
            }

            return (
                  <h1>MyReviews</h1>
            )
      }

}
export default Review;
