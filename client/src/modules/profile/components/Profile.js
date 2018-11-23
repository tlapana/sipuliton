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
                  disp: '-',
                  reviews: '-1',
                  url: "",
                  activitypoints: 0,
                  countries_visited: -1,
                  cities_visited: -1,
                  cities: [],
                  current_city: -1,
                  country: [],
                  current_country: -1,
            }
      }


      handleClick() {


            var t = this;
            fetch('http://127.0.0.1:3000/location/countries').then((response) => response.json())
                  .then((responseJson) => {
                        var countries = [];
                        var counter = 0;

                        for (var city in responseJson) {
                              if (responseJson[counter].country_id == t.state.current_country)
                                    countries.push(<option key="1" selected value={responseJson[counter].country_id}>{responseJson[counter].name}</option>)
                              else
                                    countries.push(<option key="1" value={responseJson[counter].country_id}>{responseJson[counter].name}</option>)

                              counter++;


                        }
                        t.fetchcity(t);
                        t.setState({ country: countries });
                        this.setState({ mode: !this.state.mode })

                  })
                  .catch((error) => {
                        alert("country=" + error);
                        console.error(error);
                  });

      }

      saveData() {
            var data1 = {};
            var t = this;
            data1.name = document.getElementById("name").value;
            data1.email = document.getElementById("email").value;
            data1.city = document.getElementById("city").value;
            data1.country = document.getElementById("country").value;
            data1.desc = document.getElementById("desc").value;
            data1.disp1 =document.getElementById("disp").value;;
            var url = 'http://127.0.0.1:3000/profile/edit'
                alert(data1.country );
            url += '?description=' + data1.desc;
            url += '&display_name='+   data1.disp1;
            url += '&country_id=' + data1.country ;
            url += '&city_id=' +  data1.city;

            fetch(url, {
                  method: 'GET',
                  headers: {

                  },

            })
                  .then(function (response) {
                        t.handleClick();
                        return response;
                  }).then(function (body) {
                        console.log(body);
                  });




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
      fetchcity(t) {
            fetch('http://127.0.0.1:3000/location/cities?country_id=71').then((response) => response.json())
                  .then((responseJson) => {
                        var cities1 = [];
                        var counter = 0;

                        for (var city in responseJson) {

                              if (responseJson[counter].city_id == t.state.current_city) {

                                    cities1.push(<option key="1" selected value={responseJson[counter].city_id}>{responseJson[counter].name}</option>)

                              }
                              else
                                    cities1.push(<option key="1" value={responseJson[counter].city_id}>{responseJson[counter].name}</option>)
                              counter++;


                        }
                        t.setState({ cities: cities1 });

                  })
                  .catch((error) => {
                        alert("city=" + error);
                        console.error(error);
                  });


      }
      componentWillMount() {
            var t = this;
            fetch('http://127.0.0.1:3000/profile')
                  .then((response) => response.json())
                  .then((responseJson) => {
                        try {

                              this.setState({ city: responseJson.city_name });
                              this.setState({ current_city: responseJson.city_id });
                              this.setState({ current_country: responseJson.country_id });

                        } catch (e) {
                        }
                        this.setState({ url: responseJson.image_url });

                        this.setState({ username: responseJson.display_name });
                        this.setState({ email: responseJson.email });
                        this.setState({ city: responseJson.city_name });
                        this.setState({ desc: responseJson.description });
                        this.setState({ reviews: responseJson.reviews });
                        this.setState({ disp: responseJson.display_name });

                        this.setState({ countries_visited: responseJson.countries_visited });

                        this.setState({ cities_visited: responseJson.cities_visited });

                        this.setState({ activitypoints: responseJson.activity_level });
                        this.fetchcity(t);

                  })
                  .catch((error) => {
                        alert("profile=" + error);
                        console.error(error);
                  })
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
                                                <p>Kaupunki</p>
                                          </Col>
                                          <Col xs="7">
                                                <select id="city" > {this.state.cities}

                                                </select>

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
                                                <p>Maa</p>
                                          </Col>
                                          <Col xs="7">
                                                <select id="country"  > {this.state.country}   </select>
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

                                    <Row>
                                          <Col xs="2">
                                                <p>Näyttönimi</p>
                                          </Col>
                                          <Col xs="7">
                                                <input type="text" id="disp" name="disp" defaultValue={this.state.disp} />
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
