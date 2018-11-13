import React from 'react';
import LocalizedStrings from 'react-localization';

export default class LanguageButton extends React.Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage() {
    this.props.changeLanguage(this.props.language);
  }

  render() {
    return (
      <a href="#" className="language-button" title={this.props.title}>
        <img 
          src={this.props.iconUrl} 
          onClick={this.changeLanguage} 
        />
      </a>
      
    );
  }
}
