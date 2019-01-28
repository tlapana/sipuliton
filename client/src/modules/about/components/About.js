import React from 'react';

//import '../../../styles/about.css';

/* Localization */
import LocalizedStrings from 'react-localization';

class About extends React.Component {
  render() {

    let strings = new LocalizedStrings({
      en:{
        about:"About Sipuliton",
        description:"Sipuliton.fi -service helps you to find just correct restaurant for you, where you can eat lunch and enjoy your dinner. Service takes account your eating habbits and special diets using  other users same or other special diet persons restaurant reviews. Service is developed as a part of Tampere Technical University course project of Project Work on Pervasive Systems.",
      },
      fi: {
        about:"Tietoja Sipulittomasta",
        description:"Sipuliton.fi -palvelu auttaa sinua löytämään juuri sinulle sopivan ravintolan, jossa voit lounastaa tai nauttia illallista. Palvelu huomioi ruokatottumuksesi ja erikoisruokavaliosi hyödyntäen muiden samaa tai muuta erikoisruokavaliota noudattavien henkilöiden palveluun jättämiä ravintola-arvosteluja. Palvelu on kehitetty osana Tampereen teknillisen yliopiston Project Work on Pervasive Systems -kurssin projektia.",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    return(
      <div id="about" className="max-w-40">
        <h2>{strings.about}</h2>
        <div>{strings.description}</div>
        <img className="about_logo" src={require("../../../resources/SipulitonLogoV2.png")} alt="Sipuliton logo"/>
      </div>
    );
  }
}




export default About;
