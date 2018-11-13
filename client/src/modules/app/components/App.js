import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import RouteCollection from './RouteCollection';
import NavigationBar from './NavigationBar';

import '../../../styles/app.css';
import { Link, withRouter, Redirect } from "react-router-dom";


class App extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.state = {
			theme: 'theme-1',
    };

    this.changeTheme = this.changeTheme.bind(this);
  }

  changeTheme(theme) {
    // TODO: this can be used later to add theme support
    this.setState({theme: theme});
  }

  render() {
    let classes = 'app ' + this.state.theme;
    if (this.props.isLoading) {
      classes += ' loading';
    }

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
  store: PropTypes.object.isRequired
};

export default App;
