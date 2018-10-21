import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home = () => (
  <div>
    Home
    <br/>
    <Button>Test</Button>
    <br/>

    <div>
      Here's a font awesome icon: <FontAwesomeIcon icon="ghost" />
    </div>
    <div>
      Here's another: <FontAwesomeIcon
        icon="envelope"
        color="red"
        size="2x" />
    </div>

  </div>
);

export default Home;
