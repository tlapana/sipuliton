import React, { } from 'react';

import ReactStars from 'react-stars'
import { Button, Container, Row, Col } from 'reactstrap';
import config from '../../../../config';
import { API } from "aws-amplify";

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

            var url = '/ownReviews/edit?status=0&text=' + text;
            url += "&review_id=" + this.state.review_id;
            url += "&title=" + title;
            url += "&rating_overall=" + rating_overall;
            url += "&pricing=" + pricing;
            url += "&rating_service_and_quality=" + rating_service_and_quality;

            let init = { queryStringParameters: { } };
            //fetch(url).then(response => alert('jes'));
            API.get('api', url, init)
            window.location="/fi/myReviews"

      }

      render() {
            return (
                  <div >

                        <p>Edit Information   <Button onClick={() => this.save()}>Tallenna</Button></p>

                        <Row>
                              <Col xs="2">
                                    title
                                    </Col>
                              <Col xs="4">
                                    <input type="Text" id="title" defaultValue={this.state.title} />
                              </Col>
                        </Row>
                        <Row>
                              <Col xs="2">
                                    Name
                                    </Col>
                              <Col xs="4">
                                    <input type="Text" id="title" defaultValue={this.state.name} />
                              </Col>

                        </Row>

                        <Row>
                              <Col xs="2">
                                    Image url
                                    </Col>
                              <Col xs="4">
                                    <input type="Text" id="url" defaultValue={this.state.image_url} />
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="2">
                                    Free Text
                                    </Col>
                              <Col xs="4">
                                    <input type="Text" id="free_text" defaultValue={this.state.free_text} />

                              </Col>
                        </Row>



                        <Row>
                              <Col xs="2">
                                    Overall rating
                                    </Col>
                              <Col xs="4">

                                    <ReactStars onChange={(value) => { this.setState({ rating_overall: value }) }} value={this.state.rating_overall} count={5} size={24} />
                              </Col>
                        </Row>


                        <Row>
                              <Col xs="2">
                                    Rating service and quality
                                    </Col>
                              <Col xs="4">
                                    <ReactStars onChange={(value) => { this.setState({ RatingServiceAndQuality: value }) }} value={this.state.RatingServiceAndQuality} count={5} size={24} />
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="2">
                                    Pricing
                                    </Col>
                              <Col xs="4">
                                    <ReactStars id="pricing" onChange={(value) => { this.setState({ pricing: value }) }} value={this.state.pricing} count={3} size={24} />
                              </Col>
                        </Row>






                  </div>
            )
      }
};

