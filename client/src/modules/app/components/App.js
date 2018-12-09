import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import RouteCollection from './RouteCollection';
import NavigationBar from './NavigationBar';
import write_review from '../../writereview';

import '../../../styles/app.css';
import '../../../styles/themes.css';


class App extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);

    this.getAppClasses = this.getAppClasses.bind(this);
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

export default App;
