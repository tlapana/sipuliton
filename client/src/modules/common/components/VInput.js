import React from 'react'
import { Input, } from 'reactstrap';
import CommonFunctionsApi from './CommonGlobalFunctions'
/*
 An input that simplifies validation.
 Use "isValid" prop as a variable (true/false) or a function.
 If "isValid" is used as a function, it should have 0 arguments or
 1 argument (which is the value of the input).
*/
export default class VInput extends React.Component {
  //constructor(props) {
    //super(props);
    //this.isString = this.isString.bind(this);
    //this.checkIfValid = this.checkIfValid.bind(this);
  //}

/*
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
*/
  render() {
    var { isValid, className, value, errormsg, type, ...other } = this.props;
    const valid = CommonFunctionsApi.checkIfValid(isValid, value);
    const errorClassName = valid || errormsg == null || errormsg === "" ? "input-errormsg" : "input-errormsg visible";

    if (!valid) {
      if (type === "submit") {
        return (
          <div className="input-wrapper">
            <Input
              {...other}
              value={value}
              type={type}
              className={className}
              disabled="true"
            />
            <span className={errorClassName}>{errormsg != null ? errormsg : ""}</span>
          </div>

        )
      }
      else {
        if (className != null) {
          className += ' invalid';
        }
        else {
          className = 'invalid';
        }
      }
    }

    return (
      <div className="input-wrapper">
        <Input
          {...other}
          value={value}
          type={type}
          className={className}
        />
        <span className={errorClassName}>{errormsg != null ? errormsg : ""}</span>
      </div>
    );
  }
}
