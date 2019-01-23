import React from 'react';
import { Button, Col, Form, FormGroup, Label, Row, } from 'reactstrap';
import ReactLoading from 'react-loading';
import commonComponents from '../../common';
import * as validationUtil from "../../../validationUtil";
import LocalizedStrings from 'react-localization';
import '../../../styles/profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewMode: true,
      username: '-',
      email: '-',
      city: '-',
      desc: '-',
      reviews: '-1',
      url: '',
      activitypoints: 0,
      countries_visited: -1,
      cities_visited: -1,
      cities: [],
      current_city: -1,
      citiesLoading: false,
      countries: [],
      current_country: -1,
      countriesLoading: false,
      allerg: '',
      usernameValid: true,
      emailValid: true,
      isLoading: false,
    }

    this.handleEditClicked = this.handleEditClicked.bind(this);
    this.fetchCountries = this.fetchCountries.bind(this);
    this.saveData = this.saveData.bind(this);
    this.addAllerg = this.addAllerg.bind(this);
    this.deleteAllerg = this.deleteAllerg.bind(this);
    this.fetchCities = this.fetchCities.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleAllergChange = this.handleAllergChange.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
  }


  handleEditClicked() {
    this.setState({isViewMode: false});
    this.fetchCountries();
    const country = this.state.current_country == null ? 0 : this.state.current_country;
    this.fetchCities(country);
  }

  fetchCountries() {
    this.setState({countriesLoading: true});
    fetch('http://127.0.0.1:3000/location/countries').then((response) => response.json())
      .then((responseJson) => {
        this.setState({ countries: responseJson, countriesLoading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({countriesLoading: false});
      });
  }

  saveData() {
    this.setState({isLoading: true});
    var data1 = {};
    data1.email = this.state.email;
    data1.city = this.state.current_city;
    data1.country = this.state.current_country;
    data1.desc = this.state.desc;
    data1.username = this.state.username;
    var url = 'http://127.0.0.1:3000/profile/edit'
    url += '?description=' + data1.desc;
    url += '&display_name=' + data1.username;
    url += '&country_id=' + data1.country;
    url += '&city_id=' + data1.city;
    fetch(url, {
      method: 'GET',
      headers: {},
    })
    .then((response) => {
      this.setState({isLoading: false, isViewMode: true});
    })
    .catch((err) => {
      console.log(err);
      this.setState({isLoading: false});
    });
  }


  addAllerg() {
    var data1 = {};
    data1.allerg = this.state.allerg;
    fetch('test/allerg/', {
      method: 'POST',
      headers: {},
      body: JSON.stringify(data1),
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
  }

  deleteAllerg() {
    var data1 = {};
    data1.allerg = this.state.allerg;
    fetch('test/allerg/', {
      method: 'DELETE',
      headers: {},
      body: JSON.stringify(data1),
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
  }

  fetchCities(country_id) {
    if (country_id == null) {
      return;
    }
    this.setState({citiesLoading: true});
    fetch('http://127.0.0.1:3000/location/cities?country_id=' + country_id).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ cities: responseJson, citiesLoading: false });
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
        this.setState({citiesLoading: false});
      });
  }

  componentWillMount() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.setState({isLoading: true});
    fetch('http://127.0.0.1:3000/profile')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          city: responseJson.city_name,
          current_city: responseJson.city_id,
          current_country: responseJson.country_id,
          url: responseJson.image_url,
          username: responseJson.display_name,
          email: responseJson.email,
          city: responseJson.city_name,
          desc: responseJson.description,
          reviews: responseJson.reviews,
          countries_visited: responseJson.countries_visited,
          cities_visited: responseJson.cities_visited,
          activitypoints: responseJson.activity_level,
          isLoading: false,
        });
      })
      .catch((error) => {
        alert("profile=" + error);
        console.error(error);
        this.setState({isLoading: false});
      });
  }

  handleUsernameChange(e) {
    const username = e.target.value;
    const isValid = validationUtil.validateUsername(username);
    this.setState({
      username: username,
      usernameValid: isValid,
    });
  }

  handleEmailChange(e) {
    const email = e.target.value;
    const isValid = validationUtil.validateEmail(email);
    this.setState({
      email: email,
      emailValid: isValid,
    });
  }

  handleCityChange(e) {
    const city = e.target.value;
    this.setState({current_city: city});
  }

  handleCountryChange(e) {
    const country = e.target.value;
    this.setState({current_country: country});
    this.fetchCities(country);
  }

  handleDescChange(e) {
    const desc = e.target.value;
    this.setState({desc: desc});
  }

  handleAllergChange(e) {
    const allerg = e.target.value;
    this.setState({allerg: allerg});
  }

  renderLoading() {
    let strings = new LocalizedStrings({
      en:{
        loading: "Loading...",
      },
      fi: {
        loading: "Ladataan...",
      }
    });
    strings.setLanguage(this.props.match.params.language);
    return (
      <div className="max-w-40 centered-block">
        <h3>
          {strings.loading}
          <ReactLoading type={'spinningBubbles'} className="loadingSpinner" />
        </h3>
      </div>
    );
  }

  render() {
    const { VInput, } = commonComponents;

    let strings = new LocalizedStrings({
      en:{
        editProfile: "Edit profile",
        username: "Username:",
        totalReviews: "Total reviews",
        citiesVisited: "The numbrer of cities with reviews",
        countriesVisited: "The numbrer of countries with reviews",
        activityPoints: "Activity points",
        edit: "Edit",
        username: "Username:",
        city: "City:",
        email: "Email",
        country: "Country",
        desc: "Description",
        diets: "Diets",
        save: "Save",
        addDiet: "Add diet",
        deleteDiet: "Delete diet",
        description:"Description",
        username:"Username",
        email:"Email",
        city:"City"
      },
      fi: {
        editProfile: "Muokkaa profiilia",
        username:"Käyttäjätunnus:",
        totalReviews: "Arvosteluja yhteensä",
        citiesVisited: "Paikkakuntia, joissa arvosteluja",
        countriesVisited: "Maita, joissa arvosteluja",
        activityPoints: "Aktiivisuuspisteet",
        edit: "Muokkaa",
        username: "Käyttäjänimi:",
        city: "Kaupunki:",
        email: "Sähköposti:",
        country: "Maa:",
        desc: "Kuvaus:",
        diets: "Ruokavaliot:",
        save: "Tallenna",
        addDiet: "Lisää ruokavalio",
        deleteDiet: "Poista ruokavalio",
        description:"Kuvaus",
        username:"Käyttäjänimi",
        email:"Sähköposti",
        city:"Kaupunki",
      }
    });
    strings.setLanguage(this.props.match.params.language);


    const current_city = this.state.current_city == null ? '' : this.state.current_city;
    const current_country = this.state.current_country == null ? '' : this.state.current_country;
    if (this.state.isLoading) {
      return this.renderLoading();
    }
    else if (this.state.isViewMode) {
      return (
        <div className="profile-page">
          <div>
            <Row className="profile-row">
              <Col xs="2" className="profile-picture-container">
                <div className="centered-image-div">
                  <img height="90" width="90" className="profile_image" src={this.state.url} />
                </div>
              </Col>
              <Col xs="7" className="profile-description-container">
                <div>
                  <p className="inline-block-desc desc-header">{strings.username}: </p>
                  <p className="inline-block-desc">{this.state.username}</p>
                </div>
                <div>
                  <p className="inline-block-desc desc-header">{strings.email}: </p>
                  <p className="inline-block-desc">{this.state.email}</p>
                </div>
                <div>
                  <p className="inline-block-desc desc-header">{strings.city}: </p>
                  <p className="inline-block-desc">{this.state.city}</p>
                </div>
                <div>
                  <p className="inline-block-desc desc-header">{strings.description}: </p>
                  <p className="inline-block-desc">{this.state.desc}</p>
                </div>
              </Col>
              <Col>
                <div className="profile-stat-container">
                  <div>
                    <p className="profile-stat">{strings.totalReviews}</p><p>{this.state.reviews}</p>
                  </div>
                  <div>
                    <p className="profile-stat">{strings.citiesVisited}</p><p>{this.state.cities_visited}</p>
                  </div>
                  <div>
                    <p className="profile-stat">{strings.countriesVisited}</p><p>{this.state.countries_visited}</p>
                  </div>
                  <div>
                    <p className="profile-stat">{strings.activityPoints}</p><p>{this.state.activitypoints}</p>
                  </div>
                </div>
              </Col>
            </Row>

          </div>
          <button className="profile-edit-btn btn main-btn max-w-10" onClick={this.handleEditClicked}>
            {strings.edit}
          </button>
        </div>
      );
    }
    else {
      return (
        <div className="max-w-40">
          <h2>{strings.editProfile}</h2>
          <Form>
            <FormGroup>
              <Label>{strings.username}</Label>
              <VInput isValid={this.state.usernameValid} type="text" name="name" value={this.state.username} onChange={this.handleUsernameChange} />
            </FormGroup>
            <FormGroup>
              <Label>{strings.email}</Label>
              <VInput isValid={this.state.emailValid} type="email" name="email" value={this.state.email} onChange={this.handleEmailChange} />
            </FormGroup>
            <FormGroup>
              <Label>{strings.city}</Label>
              <VInput
                type="select"
                className="custom-select"
                name="city"
                onChange={this.handleCityChange}
                disabled={this.state.citiesLoading || this.state.countriesLoading}
                value={current_city}
              >
                {
                  this.state.cities != null &&
                  this.state.cities.map((city =>
                    <option key={city.city_id} value={city.city_id}>{city.name}</option>
                  ))
                }
              </VInput>
            </FormGroup>
            <FormGroup>
              <Label>{strings.country}</Label>
              <VInput
                type="select"
                className="custom-select"
                name="country"
                onChange={this.handleCountryChange}
                disabled={this.state.citiesLoading || this.state.countriesLoading}
                value={current_country}
              >
              {
                this.state.countries != null &&
                this.state.countries.map((country =>
                  <option key={country.country_id} value={country.country_id}>{country.name}</option>
                ))
              }
              </VInput>
            </FormGroup>
            <FormGroup>
              <Label>{strings.desc}</Label>
              <VInput type="text" id="desc" name="desc" value={this.state.desc} onChange={this.handleDescChange}/>
            </FormGroup>

            <FormGroup>
              <Label>{strings.diets}</Label>
              <VInput type="text" id="allerg" name="allerg" />
            </FormGroup>

            <Button className="btn secondary-btn" onClick={this.addAllerg}>{strings.addDiet}</Button>
            <Button className="secondary-btn" onClick={this.deleteAllerg}>{strings.deleteDiet}</Button>

            <VInput
              type="submit"
              className="main-btn big-btn max-w-10"
              name="save"
              onClick={this.saveData}
              value={strings.save}
              isValid={this.state.usernameValid && this.state.emailValid}
            />
          </Form>
        </div>
      );
    }
  }
}

export default Profile;
