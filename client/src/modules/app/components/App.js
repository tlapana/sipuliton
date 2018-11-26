import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import RouteCollection from './RouteCollection';
import NavigationBar from './NavigationBar';
import { changeLoading, changeRounding, changeTheme } from '../actions';

import '../../../styles/app.css';


class App extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.getAppClasses = this.getAppClasses.bind(this);
    props.store.dispatch(changeTheme('theme-2'))
  }


  getAppClasses() {
    let classes = 'app';
    if (this.props.theme) {
      classes += ' ' + this.props.theme;
    }
    if (this.props.isRounding) {
      classes += ' rounded';
    }
    if (this.props.isLoading) {
      classes += ' loading';
    }
    return classes;
  }

  render() {

    let classes = this.getAppClasses();

    return(
      <Provider store={this.props.store}>
        <Router>
          <div className={classes}>
            <div className="content">
              <Container className="main-content" >
                <Switch>
                  <RouteCollection/>
                </Switch>
              </Container>
              <NavigationBar header_text="Sipuliton.fi"/>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isRounding: PropTypes.bool,
  theme: PropTypes.string,
};


const mapStateToProps = state => {
  console.log("test",state);
  return {
    isLoading: state.isLoading,
    isRounding: state.isRounding,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => ({
  changeLoading: isLoading => dispatch(changeLoading(isLoading)),
  changeRounding: isRounding => dispatch(changeRounding(isRounding)),
  changeTheme: newTheme => dispatch(changeTheme(newTheme))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
