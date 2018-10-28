import React, {} from 'react';


class Input extends React.Component {
      		constructor(props) {
       			super(props);
       			this.state = {
          			mode:true,
        		}
        	}
      

        handleClick()  {
       
          this.setState({mode:!this.state.mode})
        }

  async componentWillMount() {
  


 await fetch('http://127.0.0.1:3000/hello')
      		.then((response) => response.json())
      		.then((responseJson) => {
                      alert('responseJson2');
        		return responseJson;
      	})
      	.catch((error) => {
                    alert('responseJson=' + error);

        		console.error(error);
      	});

 
}

	render() { 


          if(this.state.mode)   {  
          return (   
          <div>
      
          <input
          type="button"
          value="edit"
          onClick={()=>{this.handleClick()}}
           />
          <p>Niko esimerkki</p>      
       </div>)  

       }  else   { 
             return(
               <div>
        
          <input
          type="button"
          value="edit"
          onClick={()=>{this.handleClick()}}/>
         <input type="text" name="name" value="Niko esimerkki"/><br/>
             <input type="Button" name="save" value="Tallenna"/>

        </div>)     

    }
}


}
export default Input;
