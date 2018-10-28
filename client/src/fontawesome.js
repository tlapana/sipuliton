// See https://fontawesome.com/ for more information on icons and styling
// We're using the free version

import { library } from '@fortawesome/fontawesome-svg-core';

// Only import the necessary icons
import { 
  faGhost, 
  faEnvelope,
  faHome,
  faBars,
} from '@fortawesome/free-solid-svg-icons';


// Add the necessary icons to out library; now we can use them
library.add(
  faGhost, 
  faEnvelope,
  faHome,
  faBars,
);

export default library;
