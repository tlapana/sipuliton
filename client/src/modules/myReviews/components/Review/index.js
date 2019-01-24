import React, { } from 'react';
import { browserHistory, Router, Route } from 'react-router';
import { Link, withRouter } from "react-router-dom";
import ReactStars from 'react-stars'
import { Redirect } from 'react-router-dom';
import { Button, Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactLoading from 'react-loading';
import { ClipLoader } from 'react-spinners';

import Popup from "reactjs-popup";
import { TiArrowDown } from "react-icons/ti";
import '../../../../styles/ownreview.css';
import SearchBar from '../../../../modules/home/components/SearchBar.js'
import ReactPaginate from 'react-paginate';
import Modal from 'react-responsive-modal';

import LocalizedStrings from 'react-localization';
/*class WaitReview extends React.Component {
      constructor(props) {

            super(props);
      }

      async componentDidMount()   {
     
        }

      render()  {
            return ( <div>    <ReactLoading type={'spinningBubbles'} className="loadingSpinner" /> <p>Loading</p></div>);
      }
}

*/

class Review extends React.Component {
      page = 0;
      status = 0;
      limit = 10;
      pageCount = 0;
      changed() {
            console.log(2)
      }

      send() {
            localStorage.setItem('info', "" + JSON.stringify(this.state.data));
            window.location = "/fi/myReviewEdit"

      }
      deleterow(term) {
            fetch('http://localhost:3000/ownReviews/delete?review_id=' + term)

                  .then(ans => {
                        if (ans.ok) {
                              alert('ok')
                              window.location.reload();
                        } else {
                              alert('fail')

                        }
                  })
      }
      t1 = this;


      constructor(props) {

            super(props);

            this.state = {
                  array: [],
                  mode: true,
                  title: '',
                  name: '',
                  posted: '',
                  rating_overall: 0,
                  freetext: '',
                  pricing: 0,
                  rating_variety: 0,
                  loading1:false,
                  rating_service_and_quality: 0,
                  edit: false

            }

            
       

      }
      

    

      onOpenModal(item)  {

    
            this.setState({ data: item });
            this.setState({ title: item.title });
            this.setState({ freetext: item.free_text });
            this.setState({ name: item.name });
            this.setState({ posted: item.posted });
            this.setState({ overall: item.rating_overall });
            this.setState({ pricing: item.pricing });
            this.setState({ RatingServiceAndQuality: item.rating_service_and_quality });
            this.setState({ rating_variety: item.rating_variety });
            this.setState({ id: item.review_id });
            this.setState({ open: true });
            
      };
 
      deleteItem() { fetch('http://127.0.0.1:3000/ownReviews/delete') }
      init(statusvalue) {
            var t = this;
            fetch('http://127.0.0.1:3000/ownReviews?status=' + statusvalue + '&limit=' + this.limit + '&offset=' + this.page * this.limit).then((response) => response.json())
                  .then((responseJson) => {
                 
                        var array1 = [];
      
                        //calculates page count
                        this.pageCount = responseJson.review_count / 10;
                        for (var item in responseJson.reviews) {
                              //draw the array and formats time
                              let data_item =  responseJson.reviews[item]
                              var datetime1 = new Date(data_item.posted);

                              array1.push(<div><Row  style={{   'background-color': '#72c567'}} key="1" > <Col xs="2">< button onClick={  ()=>{this.onOpenModal(data_item )}  }>  <TiArrowDown /></button> </Col><Col xs="6" key="1"><em>{data_item .name}</em></Col><Col> <ReactStars edit={false} value={data_item .rating_overall} count={5} size={24} /> </Col></Row>
                              <Row  style={{   'background-color': '#72c567'}} key="1"> <Col xs="2" key="1"></Col><Col xs="8" key="1"><em>{datetime1.getDate()}/{datetime1.getMonth() +1}/{datetime1.getFullYear()}  {datetime1.getHours()}:{datetime1.getMinutes()}</em> </Col></Row> </div>);
       
                 
                        }
                        t.setState({ array: array1 });
                        t.setState({ edit: false });
                        t.setState({ loading1: true });

                  })
                  .catch((error) => {
                        alert("review=" + error);
                        console.error(error);
                  });

      }
      componentDidMount() {
            this.init(this.status);
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

      changedvalue() {
            this.status = document.getElementById("status").value;
            this.init(this.status);
      }

      handlePageClick = data => {
            let selected = data.selected;
            this.page = selected;
            this.init(this.status);

      };


      state = {
            open: false,
      };



    

      onCloseModal = () => {
            this.setState({ open: false });
      };

       render() {
  
            const { open } = this.state;
            const ratingChanged = (newRating) => {
                  console.log(newRating)

            }

            if(this.state.loading1==false)
            return (   

                  //<ReactLoading type={'spinningBubbles'} className="loadingSpinner" />
                  <ClipLoader
            
                  sizeUnit={"px"}
                  size={150}
                  color={'#123abc'}
                  loading={true}
                />
                  

         );
      
        if(this.state.loading1)
            return (<div>
                   
                  <h1   >MyReviews  </h1>
     
                  <Modal open={open} onClose={this.onCloseModal} center>
                     
                        <Row>
                              <Col xs="4">
                                    name
                                    </Col>
                              <Col xs="4">
                                    {this.state.name}

                              </Col>
                        </Row>

                        <Row>
                              <Col xs="4">
                                    title
                                    </Col>
                              <Col xs="4">
                                    {this.state.title}
                              </Col>
                        </Row>
                        <Row>
                              <Col xs="4">
                                    freetext
                                    </Col>
                              <Col xs="4">
                                    {this.state.freetext}
                              </Col>
                        </Row>
                        <Row>
                              <Col xs="4">
                                    Posted
                                    </Col>
                              <Col xs="4">
                                    {this.state.posted}
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="4">
                                    Overall Rating
                                    </Col>
                              <Col xs="8">
                                    <ReactStars edit={false} value={this.state.overall} count={5} size={24} />
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="4">
                                    Pricing
                                    </Col>
                              <Col xs="8">
                                    <ReactStars edit={false} value={this.state.pricing} count={3} size={24} />
                              </Col>
                        </Row>


                        <Row>
                              <Col xs="4">
                                    Rating service and quality
                                    </Col>
                              <Col xs="8">
                                    <ReactStars edit={false} value={this.state.RatingServiceAndQuality} count={5} size={24} />
                              </Col>
                        </Row>

                        <Row>
                              <Col xs="4">
                                    Rating variety
                                    </Col>
                              <Col xs="8">
                                    <ReactStars edit={false} value={this.state.rating_variety} count={5} size={24} />
                              </Col>
                        </Row>



                        <Button onClick={() => { this.send() }} >Edit</Button><Button onClick={() => { this.deleterow(this.state.id) }}>Delete</Button>

                  </Modal>


                  <em class="text" id="test">Status</em><select id="status" onChange={() => { this.changedvalue() }}>
                        <option value="0">Odottaa</option>
                        <option value="1">Hyväksytty</option>
                        <option value="2">Hylätty</option>
                  </select>
                  <ReactPaginate id={"react-paginate"} initialPage={0} onPageChange={this.handlePageClick} previousLabel={'<<'} nextLabel={'>>'} breakLabel={'...'} breakClassName={'break-me'} pageCount={this.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                        containerClassName={'pagination'}

                        subContainerClassName={'pages pagination'}

                        activeClassName={'active'} />
                  <div >
         
                        {this.state.array}
                  </div>
            </div>);
      
      }
      

}
export default Review;
