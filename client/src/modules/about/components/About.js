import React from 'react';

//import '../../../styles/about.css';

/* Localization */
import LocalizedStrings from 'react-localization';

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let strings = new LocalizedStrings({
      en:{
        about:"About Sipuliton",
        description:"Sipuliton.fi is going to be web application where people can review and search restaurants by different kind of diets and food allergies. Page is trying to help people to find better restaurants easier for their diets and allergies. Page development is part of Tampere's University of Technology course Project Work on Pervasive Systems and it is development by group of seven students.",
      },
      fi: {
        about:"Tietoja Sipulittomasta",
        description:"Sipuliton.fi on web ohjelma, jolla henkilöt voivat etsiä ja arvostella ravintoloita, heidän erilaisten ruoka diettien ja ruoka allergioiden perusteella. Sivun tarkoitus on auttaa henkilöitä löytämään paremmat heidän ruokarajoitteisiin sopivat ravintolat helpommin. Sivu on kehitetty osana Tampereen teknillisen yliopiston Project Work on Pervasive Systems -kurssin projektia. Ryhmään kuului yhteensä seitsemän henkilöä ja sivuston tilaajana ja nykyisenä omistajana toimii Toni Leppänen. ",
      }
    });
    strings.setLanguage(this.props.match.params.language);

    return(
      <div id="about" className="max-w-40">
        <h2>{strings.about}</h2>
        <img src={require("../../../resources/SipulitonLogoV1.ico")} alt="Sipuliton logo"/>
        <div>{strings.description}</div>
      </div>
    );
  }
}




export default About;
