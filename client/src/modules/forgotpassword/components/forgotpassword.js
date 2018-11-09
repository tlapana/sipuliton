import React from 'react';

import ForgotPasswordForm from './ForgotPassword_Form.js'

/* Localization */
import LocalizedStrings from 'react-localization';

class ForgotPassword extends React.Component {
  /* Constructor of the navication bar class. */
  constructor(props) {
    super(props);
  }
  render() {
    /* Localization */
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
      <div id="forgotPassword">
        <h2>{strings.forgotpassword}</h2>
        <ForgotPasswordForm language={this.props.match.params.language}/>
      </div>
    )
  }
}


export default ForgotPassword;
