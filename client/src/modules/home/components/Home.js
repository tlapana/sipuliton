import React from 'react';
import { Button,Component, Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from './Home2';

var name='a';
 async function init()  {

   alert('b' + await request());
}

var  request = async  () => {
   let response =  await fetch('https://facebook.github.io/react-native/movies.json');
  // only proceed once promise is resolved
  let data =  await response.json();
name='b';
  // only proceed once second promise is resolved

  return data;
}
 async function getMoviesFromApiAsync() {



const json = await fetch('https://facebook.github.io/react-native/movies.json');

alert('a'+json[0]);
console.log(json);


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
<Row>
    <Col xs="2">    
<p>Image</p>

</Col>
          <Col xs="7">
           <Input/>
           <p>Arvosteluja yhteensä.......................</p>
           <p>Paikkakuntia, joissa arvosteluja...........</p>
           <p>Maita, joissa arvosteluja..................</p>
           <p>Erityisruokavalioita/Dieetti</p>
           </Col>
        </Row>
          <Row> 
          <Col xs="2">
          <input type="text" class="form-control" />
          <input type="text" class="form-control" />
             <input type="text" class="form-control" />
               <button type="button" class="btn btn-default btn-sm">Lisää</button>  <button type="button" class="btn btn-default btn-sm">Poista</button>
           </Col>
        </Row>
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
