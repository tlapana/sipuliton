import React from 'react';
import { Row, Col } from 'reactstrap';
  
  
class Profile extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
                  mode: true,
                  username: '-',
                  email: '-',
                  city: '-',
                  desc: '-',
                  reviews: '-1',
                  url: "",
                  activitypoints: 0,
                  countries_visited: -1,
                  cities_visited: -1,
            }
      }


      handleClick() {

            this.setState({ mode: !this.state.mode })
      }

      saveData() {
            var data1 = {};
            data1.name = document.getElementById("name").value;
            data1.email = document.getElementById("email").value;
            data1.city = document.getElementById("city").value;
            data1.desc = document.getElementById("desc").value;

            fetch('test/students/', {
                  method: 'POST',
                  headers: {

                  },
                  body: JSON.stringify(data1),
            })
                  .then(function (response) {

                        return response;
                  }).then(function (body) {
                        console.log(body);
                  });



            this.handleClick();
      }


      addAllerg() {
            var data1 = {};
            data1.allerg = document.getElementById("allerg").value;
            fetch('test/allerg/', {
                  method: 'POST',
                  headers: {

                  },
                  body: JSON.stringify(data1),
            })
                  .then(function (response) {
                        return response;
                  }).then(function (body) {
                        console.log(body);
                  });


      }

      deleteAllerg() {
            var data1 = {};
            data1.allerg = document.getElementById("allerg").value;
            fetch('test/allerg/', {
                  method: 'DELETE',
                  headers: {
                  },
                  body: JSON.stringify(data1),
            })
                  .then(function (response) {
                        return response;
                  }).then(function (body) {
                        console.log(body);
                  });
      }

      componentWillMount() {

            fetch('http://127.0.0.1:3000/profile')
                  .then((response) => response.json())
                  .then((responseJson) => {
                        this.setState({ url: responseJson.image_url });

                        this.setState({ username: responseJson.display_name });
                        this.setState({ email: responseJson.email });
                        this.setState({ city: responseJson.city_name });
                        this.setState({ desc: responseJson.description });
                        this.setState({ reviews: responseJson.reviews });

                        this.setState({ countries_visited: responseJson.countries_visited });

                        this.setState({ cities_visited: responseJson.cities_visited });

                        this.setState({ activitypoints: responseJson.activity_level });

                  })
                  .catch((error) => {
                        alert(error);
                        console.error(error);
                  });

      }

      render() {


            if (this.state.mode) {
                  return (
                        <div>
                              <Row>

                                    <Col xs="2">
                                          <img width="90" src={this.state.url} />
                                    </Col>
                                    <Col xs="7">

                                          <input
                                                type="button"
                                                value="edit"
                                                onClick={() => { this.handleClick() }}
                                          />
                                          <p>{this.state.username}</p>
                                          <p>{this.state.email}</p>

                                          <p>{this.state.city}</p>
                                          <p>{this.state.desc}</p>


                                    </Col>
                              </Row>
                              <p>Arvosteluja yhteensä  .................. {this.state.reviews}</p>
                              <p>Paikkakuntia, joissa arvosteluja ...  {this.state.cities_visited}</p>
                              <p>Maita,joissa arvosteluja ................{this.state.countries_visited}</p>
                              <p>Aktiivisuuspisteet...........................{this.state.activitypoints}</p>

                        </div>)
            } else {
                  return (
                        <div>
                              <form>
                                    <Row>
                                          <Col xs="2">

                                          </Col>
                                          <Col xs="7">
                                                <input type="Button" name="save" onClick={() => { this.saveData() }} value="Tallenna" />
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs="2">
                                                <p>nimi</p>
                                          </Col>
                                          <Col xs="7">
                                                <input type="text" id="name" name="name" defaultValue={this.state.username} />
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs="2">
                                                <p>sähköposti</p>
                                          </Col>
                                          <Col xs="7">
                                                <input type="text" id="email" name="email" defaultValue={this.state.email} />
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs="2">
                                                <p>Kaupunki</p>
                                          </Col>
                                          <Col xs="7">
                                                <input type="text" id="city" name="city" defaultValue={this.state.city} />
                                          </Col>
                                    </Row>
                                    <Row>
                                          <Col xs="2">
                                                <p>Kuvaus</p>
                                          </Col>
                                          <Col xs="7">
                                                <input type="text" id="desc" name="desc" defaultValue={this.state.desc} />
                                          </Col>
                                    </Row>
                                    <br />
                                    <br />
                                    <input type="text" id="allerg" name="allerg" /> <br />
                                    <input type="button" value="Lisää" onClick={() => { this.addAllerg() }} />
                                    <input type="button" value="Poista" onClick={() => { this.deleteAllerg() }} />
                              </form>
                        </div>)
            }
      }
}
export default Profile;
