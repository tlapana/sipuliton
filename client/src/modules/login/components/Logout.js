import React from 'react';
import { Button } from 'reactstrap';
import { Auth } from 'aws-amplify';

import LocalizedStrings from 'react-localization';

/*
Component for a separate logout view.
When a user navigates to this view, they will be logged out.
*/
class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logoutError: false };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.logout();
  }

  /* This method implements user log out. */
  logout(){
    Auth.signOut()
        .then(data => this.setState({ logoutError: false }))
        .catch(err => { console.log(err); this.setState({ logoutError: true }); });
  }

  render() {
    /* Localization */
    let strings = new LocalizedStrings({
      en:{
        login: "Login",
        loggedout: "You have successfully been logged out!",
        loggedouterr: "Logout was unsuccessful, please try again!",
      },
      fi: {
        login: "Kirjaudu",
        loggedout: "Uloskirjautuminen onnistui!",
        loggedouterr: "Uloskirjautuminen ei onnistunut, yritäthän uudestaan!",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    /* URL paths */
    const pathToLogin = '/' + this.props.match.params.language + '/login/';
    let text = this.state.logoutError ? strings.loggedouterr : strings.loggedout;

    return(
      <div className="max-w-40 centered-block">
         <h2>{text}</h2>
         <br/>
        <Button className="main-btn big-btn max-w-10" href={pathToLogin} color="none" block>
          {strings.login}
        </Button>
      </div>
    )
  }
}




export default Logout;
