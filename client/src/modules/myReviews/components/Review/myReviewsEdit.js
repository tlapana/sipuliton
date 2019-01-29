import React, { } from 'react';

import ReactStars from 'react-stars'
import { Button, Container, Row, Col } from 'reactstrap';
import commonComponents from '../../../common';

import LocalizedStrings from 'react-localization';

export default class myReviewEdit1 extends React.Component {
      constructor(props) {
            super(props);
            var data = JSON.parse(localStorage.getItem('info'));

            this.state = {

                  review_id: data.review_id,
                  title: data.title,
                  name: data.name,
                  image_url: data.image_url,
                  free_text: data.free_text,
                  status: data.status,
                  RatingServiceAndQuality: data.rating_service_and_quality,
                  pricing: data.pricing,
                  rating_overall: data.rating_overall,
                  rating_variety: data.rating_variety,
                  rating_reliability: data.rating_reliability


            }



      }

      save() {

            var text = document.getElementById("free_text").value;
            var title = document.getElementById("title").value;
            var pricing = this.state.pricing;
            var rating_service_and_quality = this.state.RatingServiceAndQuality;
            var rating_overall = this.state.rating_overall;

            var url = 'http://127.0.0.1:3000/ownReviews/edit?status=0&text=' + text;
            url += "&review_id=" + this.state.review_id;
            url += "&title=" + title;
            url += "&rating_overall=" + rating_overall;
            url += "&pricing=" + pricing;
            url += "&rating_service_and_quality=" + rating_service_and_quality;
            fetch(url).then(response => alert('jes'));
            window.location="/fi/myReviews"

      }

      render() {

            let strings = new LocalizedStrings({

                  en: {
                    title: "Edit information",
                    save: "Save",
                    rewtitle: "Review title",
                    name: "Name",
                    url: "Image url",
                    freetext: "Free text",
                    overall: "Overall rating",
                    ratingServiveAndQuality: "Rating service and quality",
                    pricing: "Price",


                  },
            
                  fi: {
                    title: "Muuta tietoja",
                    save: "Tallenna",
                    rewtitle: "Otsikko",
                    name:"Nimi",
                    url: "Kuvan url",
                    freetext: "Vapaa teksti",
                    overall: "Yleisarviointi",
                    ratingServiveAndQuality: "Palvelu ja laatu",
                    pricing: "Hinta",
       

                  }
            
                });
                strings.setLanguage(this.props.match.params.language);
            const { VInput, ErrorBlock } = commonComponents;
            return (
                  <div >

                        <p>{strings.title}   <Button onClick={() => this.save()}>{strings.save}</Button></p>

                        <Row>
                              <Col xs="2">
                              {strings.rewtitle} 
                                    </Col>
                              <Col xs="4">
                              <VInput  defaultValue={this.state.title}  type="text" name="title" required autoFocus={true} />
            
                              </Col>
                        </Row>
                        <Row>
                              <Col xs="2">
                              {strings.name} 
                                    </Col>
                              <Col xs="4">
                      
                                    <VInput  defaultValue={this.state.name}  type="text" name="name" required autoFocus={true} />
                              </Col>

                        </Row>

                        <Row>
                              <Col xs="2">
                              {strings.url} 
                                    </Col>
                              <Col xs="4">
                              <VInput  defaultValue={this.state.image_url}  type="text" name="url" required autoFocus={true} />
                                  
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="2">
                              {strings.freetext} 
                                    </Col>
                              <Col xs="4">
                             
                                    <VInput  defaultValue={this.state.free_text}  type="text" id="free_text" required autoFocus={true} />

                              </Col>
                        </Row>



                        <Row>
                              <Col xs="2">
                                    {strings.overall}
                                    </Col>
                              <Col xs="4">

                                    <ReactStars onChange={(value) => { this.setState({ rating_overall: value }) }} value={this.state.rating_overall} count={5} size={24} />
                              </Col>
                        </Row>


                        <Row>
                              <Col xs="2">
                                    {strings.ratingServiveAndQuality}
                                    </Col>
                              <Col xs="4">
                                    <ReactStars onChange={(value) => { this.setState({ RatingServiceAndQuality: value }) }} value={this.state.RatingServiceAndQuality} count={5} size={24} />
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="2">
                                    {strings.pricing}
                                    </Col>
                              <Col xs="4">
                                    <ReactStars id="pricing" onChange={(value) => { this.setState({ pricing: value }) }} value={this.state.pricing} count={3} size={24} />
                              </Col>
                        </Row>






                  </div>
            )
      }
};

