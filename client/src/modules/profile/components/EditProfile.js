import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, } from 'reactstrap';
import ReactLoading from 'react-loading';
import commonComponents from '../../common';
import * as validationUtil from "../../../validationUtil";
import LocalizedStrings from 'react-localization';
import { API, Auth } from 'aws-amplify';

import '../../../styles/profile.css';


class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      id: id,
      username: '-',
      email: '-',
      city: '-',
      desc: '-',
      url: '',
      activitypoints: 0,
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
      isSaving: false,
    }

    this.fetchCountries = this.fetchCountries.bind(this);
    this.saveData = this.saveData.bind(this);
    this.addAllerg = this.addAllerg.bind(this);
    this.deleteAllerg = this.deleteAllerg.bind(this);
    this.fetchCities = this.fetchCities.bind(this);
    this.goBack = this.goBack.bind(this);
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

  async fetchCountries() {
    this.setState({countriesLoading: true});
    return fetch('http://127.0.0.1:3000/location/countries').then((response) => response.json())
      .then((responseJson) => {
        this.setState({ countries: responseJson, countriesLoading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({countriesLoading: false});
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

  async fetchCities(country_id) {
    if (country_id == null) {
      return;
    }
    this.setState({citiesLoading: true});
    return fetch('http://127.0.0.1:3000/location/cities?country_id=' + country_id).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ cities: responseJson, citiesLoading: false });
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
        this.setState({citiesLoading: false});
      });
  }

  async componentWillMount() {
    let res = await this.fetchProfile();
    this.fetchCountries();
    const country = this.state.current_country == null ? 0 : this.state.current_country;
    this.fetchCities(country);
  }

  goBack() {
    const { language } = this.props.match.params;
    this.props.history.push('/' + language + '/profile/' + this.state.id);
  }

  async fetchProfile() {
    this.setState({isLoading: true});
    const init = {
      queryStringParameters: {
        user_id: this.state.id
      }
    }
    return API.get('api', '/profile', init)
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

  saveData() {
    this.setState({isSaving: true});
    var data1 = {};
    data1.email = this.state.email;
    data1.city = this.state.current_city;
    data1.country = this.state.current_country;
    data1.desc = this.state.desc;
    data1.username = this.state.username;
    var url = '/profile/edit'
    url += '?description=' + data1.desc;
    url += '&display_name=' + data1.username;
    url += '&country_id=' + data1.country;
    url += '&city_id=' + data1.city;
    const init = {
      queryStringParameters: {
        user_id: this.state.id
      }
    }
    API.get('api', url, init)
      .then((response) => {
        const { language } = this.props.match.params;
        this.props.history.push('/' + language + '/profile/' + this.state.id);
      })
      .catch((err) => {
        console.log(err);
        this.setState({isSaving: false});
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
        city: "City:",
        email: "Email",
        country: "Country",
        desc: "Description",
        diets: "Diets",
        save: "Save",
        saving: "Saving",
        addDiet: "Add diet",
        deleteDiet: "Delete diet",
        cancel: "Cancel",
      },
      fi: {
        editProfile: "Muokkaa profiilia",
        username: "Käyttäjänimi:",
        city: "Kaupunki:",
        email: "Sähköposti:",
        country: "Maa:",
        desc: "Kuvaus:",
        diets: "Ruokavaliot:",
        save: "Tallenna",
        saving: "Tallennetaan",
        addDiet: "Lisää ruokavalio",
        deleteDiet: "Poista ruokavalio",
        cancel: "Peruuta",
      }
    });
    strings.setLanguage(this.props.match.params.language);


    const current_city = this.state.current_city == null ? '' : this.state.current_city;
    const current_country = this.state.current_country == null ? '' : this.state.current_country;
    let saveBtnStr = this.state.isSaving ? strings.saving : strings.save;

    if (this.state.isLoading) {
      return this.renderLoading();
    }

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
          
          <Button className="btn secondary-btn btn-margin" onClick={this.addAllerg}>{strings.addDiet}</Button>
          <Button className="btn secondary-btn btn-margin" onClick={this.deleteAllerg}>{strings.deleteDiet}</Button>
          
          <div>
            <Button className="btn main-btn max-w-10" onClick={this.goBack}>{strings.cancel}</Button>
            <VInput 
              type="button" 
              className="main-btn big-btn btn-margin max-w-10"
              wrapperClassName="max-w-10 no-margin inline-block w-100-percent save-btn"
              name="save" 
              onClick={this.saveData} 
              value={saveBtnStr} 
              isValid={this.state.usernameValid && this.state.emailValid && !this.state.isSaving}
            />
          </div>
          
        </Form>
      </div>
    );
  }
}

export default withRouter(EditProfile);
