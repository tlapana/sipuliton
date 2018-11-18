import React from 'react'
import { Input, } from 'reactstrap';

/* 
 An input that simplifies validation. 
 Use "isValid" prop as a variable (true/false) or a function. 
 If "isValid" is used as a function, it should have 0 arguments or 
 1 argument (which is the value of the input).
*/
export default class VInput extends React.Component {
  constructor(props) {
    super(props);
  }

  isString(value) {
    return (typeof value === 'string' || value instanceof String)
  }

  checkIfValid(isValid, value) {
    if (isValid != null) {
      if (typeof isValid === 'function') {
        if (isValid.length === 0 && !isValid()) {
          return false;
        }
        else if (isValid.length === 1 && !isValid(value)) {
          return false;
        }
      }
      else if (this.isString(isValid) && isValid.toLowerCase() === 'false') {
          return false;
      }
      else if (!isValid) {
        return false;
      }
    }

    return true;
  }

  render() {
    var { isValid, className, value, type, ...other } = this.props;
    const valid = this.checkIfValid(isValid, value);
    
    if (!valid) {
      if (type === "submit") {
        return (
          <Input
            {...other}
            value={value}
            type={type}
            className={className}
            disabled="true"
          />
        )
      }
      else {
        className += ' invalid';
      }
    }

    return (
      <Input
        {...other}
        value={value}
        type={type}
        className={className}
      />
    );
  }
}
