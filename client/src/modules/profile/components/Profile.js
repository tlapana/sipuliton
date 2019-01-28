import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, } from 'reactstrap';
import ReactLoading from 'react-loading';
import LocalizedStrings from 'react-localization';
import { API, Auth } from 'aws-amplify';
import Config from '../../../config.js';


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
  }


  handleEditClicked() {
    const { language } = this.props.match.params;
    let id = this.state.id != null ? this.state.id : this.props.currentUserId;
    this.props.history.push('/' + language + '/edit-profile/' + id);
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
      },
      fi: {
        editProfile: "Muokkaa profiilia",
        totalReviews: "Arvosteluja yhteensä",
        citiesVisited: "Paikkakuntia, joissa arvosteluja",
        countriesVisited: "Maita, joissa arvosteluja",
        activityPoints: "Aktiivisuuspisteet",
        edit: "Muokkaa",
        diets: "Ruokavaliot:",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    if (this.state.isLoading) {
      return this.renderLoading();
    }

    const isOwnProfile = this.state.id == null && this.props.currentUserId != null || 
      this.props.currentUserId == this.state.id && this.props.currentUserId != null;

    return (
      <div className="max-w-40">
        <Row>
          <Col xs="2">
            <img width="90" src={this.state.url} />
          </Col>
          <Col xs="7">
            <p>{this.state.username}</p>
            <p>{this.state.email}</p>

            <p>{this.state.city}</p>
            <p>{this.state.desc}</p>
          </Col>
        </Row>
        <p>{strings.totalReviews} .................. {this.state.reviews}</p>
        <p>{strings.citiesVisited} ...  {this.state.cities_visited}</p>
        <p>{strings.countriesVisited} ................{this.state.countries_visited}</p>
        <p>{strings.activityPoints} ...........................{this.state.activitypoints}</p>
        {
          isOwnProfile && 
          <button className="btn main-btn max-w-10" onClick={this.handleEditClicked}>
            {strings.edit}
          </button>
        }
        
      </div>
    );
  }
}

export default withRouter(Profile);
