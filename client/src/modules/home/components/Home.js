import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from './Home2';

var name='a';

var  add = () => {


 var data1={};
data1.key=document.getElementById("allerg").value;


fetch('test/students/', {
    method: 'POST',
    headers: {
  
  },
    body: JSON.stringify(data1),
  })
    .then(function(response) {
        return response;
      }).then(function(body) {
        console.log(body);
      });
  
  }

var  remove = () => {
 var data1={};
data1.key=document.getElementById("allerg").value;

fetch('test/students/', {
    method: 'POST',
    headers: {
  
  },
    body: JSON.stringify(data1),
  })
    .then(function(response) {
        return response;
      }).then(function(body) {
        console.log(body);
      });
  
  }
 async function init()  {

   await request();
}


var  request = async  () => {
   let response =  await fetch('https://facebook.github.io/react-native/movies.json');
  // only proceed once promise is resolved
  let data =  await response.json();
name='b';
  // only proceed once second promise is resolved

  return data;
}



const Home =    ()=> (
init(),


<div>

<Container>
              <Row>
           <Col xs="6">
            <h4>Profiili & asetukset</h4>
           </Col>

           </Row>
           <Input/>

</Container>
    Home12
    <br/>
    <Button>Test123</Button>
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
