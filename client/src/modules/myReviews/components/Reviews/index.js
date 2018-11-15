import React, { } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
 import ReactDOM from "react-dom";

class Profile extends React.Component {

  constructor(props) {
    super(props);
  }
 
  handlePageChange(pageNumber) {
  }
 
  render() {
    return (
      <div>
 	<h3> My reviews</h3>
        <input type="Button" value="left"/>
             <input type="Button" value="rigth"/>

      </div>
    );
  }

}
export default Profile;
