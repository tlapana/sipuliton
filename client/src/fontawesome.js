// See https://fontawesome.com/ for more information on icons and styling
// We're using the free version

import { library } from '@fortawesome/fontawesome-svg-core';

// Only import the necessary icons
import {
  faGhost,
  faEnvelope,
  faHome,
  faBars,
  faSearch,
  faStar,
  faStarHalf,
} from '@fortawesome/free-solid-svg-icons';

import { 
  faGoogle, 
  faFacebook, 
  faFacebookF, 
} from '@fortawesome/free-brands-svg-icons'

// Add the necessary icons to out library; now we can use them
library.add(
  faFacebook,
  faFacebookF,
  faGoogle,
  faGhost,
  faEnvelope,
  faHome,
  faBars,
  faSearch,
  faStar,
  faStarHalf,
);

export default library;
