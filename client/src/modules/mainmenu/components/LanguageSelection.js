import React from 'react';
import LocalizedStrings from 'react-localization';

import LanguageButton from './LanguageButton';


export default class LanguageSelection extends React.Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(language) {
    this.props.changeLanguage(language);
  }

  render() {
    return (
      <div className="language-container">
        <LanguageButton
          language="fi"
          iconUrl={require("../../../resources/suomilippu_logo.ico")}
          changeLanguage={this.changeLanguage}
          title="suomi"
        />
        <LanguageButton
          language="en"
          iconUrl={require("../../../resources/englanninlippu_logo.ico")}
          changeLanguage={this.changeLanguage}
          title="English"
        />
      </div>
    );
  }
}
