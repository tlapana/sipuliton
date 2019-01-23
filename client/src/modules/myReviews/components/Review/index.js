import React, { } from 'react';
import ReactStars from 'react-stars'
import { Button, Row, Col } from 'reactstrap';

import Popup from "reactjs-popup";
import { TiArrowDown } from "react-icons/ti";
import '../../../../styles/ownreview.css';
import ReactPaginate from 'react-paginate';



class ReviewData extends React.Component {
   
      constructor(props) {
            super(props);

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
       window.location="/fi/myReviewEdit"

     }
     deleterow(term)  {
         fetch('http://localhost:3000/ownReviews/delete?review_id=' + term)

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
                                             <ReactStars edit={false} value = {this.state.overall}  count = {5} size = {24} />   
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="4">
                                        Pricing
                                    </Col>
                                    <Col xs="8">
                                             <ReactStars edit={false} value = {this.state.pricing}  count = {3} size = {24} />   
                                    </Col>
                              </Row>


                              <Row>
                                    <Col xs="4">
                                        Rating service and quality
                                    </Col>
                                    <Col xs="8">
                                             <ReactStars edit={false} value = {this.state.RatingServiceAndQuality}  count = {5} size = {24} />   
                                    </Col>
                              </Row>

                              <Row>
                                    <Col xs="4">
                                        Rating variety
                                    </Col>
                                    <Col xs="8">
                                             <ReactStars edit={false} value = {this.state.rating_variety}  count = {5} size = {24} />   
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
     status=0;
     limit=10;
     pageCount=0;
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

      deleteItem() { fetch('http://127.0.0.1:3000/ownReviews/delete') }
      init(statusvalue)  {
            var t = this;
            fetch('http://127.0.0.1:3000/ownReviews?status=' + statusvalue + '&limit=' + this.limit +'&offset='+this.page*this.limit).then((response) => response.json())
                  .then((responseJson) => {
                             var array1=[];

                             //calculates page count
                             this.pageCount=responseJson.review_count/10;
                             for(var item in responseJson.reviews)  {
                   
                        //draw the array and formats time
                        var datetime1=new Date(responseJson.reviews[item].posted);

              
                          array1.push(<Row key="1"> <Col  xs="2">  <Popup key="1" trigger={<button key="2"> <TiArrowDown /></button>} position="bottom left"><div ><ReviewData data={responseJson.reviews[item]} key="1"/></div></Popup> </Col><Col  xs="4" key="1"><em>{responseJson.reviews[item].name}</em></Col><Col> <ReactStars edit={false} value = {responseJson.reviews[item].rating_overall}  count = {5} size = {24} /> </Col></Row>);
                          array1.push(<Row key="1"> <Col  xs="2" key="1"></Col><Col  xs="8"  key="1"><em>{datetime1.getDate()}/{datetime1.getMonth()}/{datetime1.getFullYear()}  {datetime1.getHours()}:{datetime1.getSeconds()}</em> </Col></Row>);
                          array1.push(<Row key="1"> <Col   key="1"><hr/></Col></Row>);       
                        
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
          this.status=document.getElementById("status").value;
          this.init(this.status);
      }

      handlePageClick = data => {
            let selected = data.selected;
            this.page=selected;
            this.init(this.status);     

      };

      render() {

                  return (<div>
                        <h1   >MyReviews  </h1>
                        <em id="test">Status</em><select id="status"  onChange={()=>{this.changedvalue()}}>
                        <option value="0">Odottaa</option>
                        <option value="1">Hyväksytty</option>
                        <option value="2">Hylätty</option>
                         </select>
                        <ReactPaginate  id={"react-paginate"}  initialPage={0}  onPageChange={this.handlePageClick}  previousLabel={'<<'} nextLabel={'>>'}  breakLabel={'...'} breakClassName={'break-me'} pageCount={this.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                                containerClassName={'pagination'}

                                subContainerClassName={'pages pagination'}
                        
                        activeClassName={'active'}/>
                        <div style={{"width":"500px","overflow": "scroll","height": "300px"}}>
                               {this.state.array}
                       </div>
                  </div>);
      }

}
export default Review;
