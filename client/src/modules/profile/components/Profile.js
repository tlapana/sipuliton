import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, } from 'reactstrap';
import ReactLoading from 'react-loading';
import LocalizedStrings from 'react-localization';
import { API, Auth } from 'aws-amplify';

import '../../../styles/profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;

    this.state = {
      id: id,
      username: '-',
      email: '-',
      city: '-',
      desc: '-',
      reviews: '-1',
      url: '',
      activitypoints: 0,
      countries_visited: -1,
      cities_visited: -1,
      current_city: -1,
      citiesLoading: false,
      current_country: -1,
      countriesLoading: false,
      allerg: '',
      isLoading: false,
    }

    this.handleEditClicked = this.handleEditClicked.bind(this);
    this.fetchProfile = this.fetchProfile.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.handleChangePasswordClicked = this.handleChangePasswordClicked.bind(this);
  }


  handleEditClicked() {
    const { language } = this.props.match.params;
    let id = this.state.id != null ? this.state.id : this.props.currentUserId;
    this.props.history.push('/' + language + '/edit-profile/' + id);
  }

  handleChangePasswordClicked() {
    const { language } = this.props.match.params;
    this.props.history.push('/' + language + '/modCog/');
  }

  async componentWillMount() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.setState({isLoading: true});
    var init = {};
    if (this.state.id != null) {
      init = {
        queryStringParameters: {
          user_id: this.state.id
        }
      };
    }
    
    API.get('api', '/profile', init)
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
    let strings = new LocalizedStrings({
      en:{
        editProfile: "Edit profile",
        totalReviews: "Total reviews",
        citiesVisited: "The numbrer of cities with reviews",
        countriesVisited: "The numbrer of countries with reviews",
        activityPoints: "Activity points",
        edit: "Edit",
        country: "Country",
        diets: "Diets",
        save: "Save",
        addDiet: "Add diet",
        deleteDiet: "Delete diet",
        description:"Description",
        username:"Username",
        email:"Email",
        city:"City",
        changePassword: "Change password",
      },
      fi: {
        editProfile: "Muokkaa profiilia",
        totalReviews: "Arvosteluja yhteensä",
        citiesVisited: "Paikkakuntia, joissa arvosteluja",
        countriesVisited: "Maita, joissa arvosteluja",
        activityPoints: "Aktiivisuuspisteet",
        edit: "Muokkaa",
        country: "Maa",
        diets: "Ruokavaliot:",
        save: "Tallenna",
        addDiet: "Lisää ruokavalio",
        deleteDiet: "Poista ruokavalio",
        description:"Kuvaus",
        username:"Käyttäjänimi",
        email:"Sähköposti",
        city:"Kaupunki",
        changePassword: "Vaihda salasana",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    if (this.state.isLoading) {
      return this.renderLoading();
    }

    const isOwnProfile = this.state.id == null && this.props.currentUserId != null || 
      this.props.currentUserId == this.state.id && this.props.currentUserId != null;

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
        {
          isOwnProfile && 
          <button className="profile-edit-btn btn main-btn max-w-10" onClick={this.handleEditClicked}>
            {strings.edit}
          </button> 
        }
        {
          isOwnProfile &&
          <button className="change-password-btn btn main-btn max-w-10" onClick={this.handleChangePasswordClicked}>
            {strings.changePassword}
          </button>
        }
        
      </div>
    );
  }
}

export default withRouter(Profile);
