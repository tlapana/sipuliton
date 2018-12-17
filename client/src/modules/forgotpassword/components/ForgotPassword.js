import React from 'react';
import { Auth } from 'aws-amplify';
import { Redirect } from 'react-router-dom';

import ForgotPasswordForm from './ForgotPassword_Form.js';

/* Localization */
import LocalizedStrings from 'react-localization';

class ForgotPassword extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
    this.state = {
      loggedInAlready: false,
    }
  }
  
  componentDidMount() {
    Auth.currentAuthenticatedUser()
        .then(user => {
          this.setState({ loggedInAlready: true });
        })
        .catch(err => {});
  }

  render() {
    if (this.state.loggedInAlready) {
      return <Redirect to={"/" + this.props.match.params.language + "/profile"} />
    }
    
    let strings = new LocalizedStrings({
      en:{
        forgotpassword:"Forgot password?",
      },
      fi: {
        forgotpassword:"Unohtuiko salasana?",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    return(
      <div id="forgotPassword" className="max-w-40">
        <h2>{strings.forgotpassword}</h2>
        <ForgotPasswordForm language={this.props.match.params.language}/>
      </div>
    );
  }
}


export default ForgotPassword;
