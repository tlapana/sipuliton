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
  }

  render() {
    return(
      <Provider store={this.props.store}>
        <Router>
          <div className={'app ' + this.state.theme}>
            <div className="content">
              <Container className="main-content" >
                <Switch>
                  <RouteCollection/>
                </Switch>
              </Container>
              <NavigationBar  header_text="Sipuliton.fi"/>
            </div>
          </div>
        </Router>
      </Provider>
    )
  }

}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
