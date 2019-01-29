import React from 'react'
import { Input, } from 'reactstrap';
import CommonFunctionsApi from './CommonGlobalFunctions'
import { combineReducers } from 'redux';
/*
 An input that simplifies validation.
 Use "isValid" prop as a variable (true/false) or a function.
 If "isValid" is used as a function, it should have 0 arguments or
 1 argument (which is the value of the input). 
 Use wrapperClassName to add css classes to the wrapper. 
*/
export default class VInput extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var { isValid, className, value, errormsg, type, wrapperClassName, ...other } = this.props;
    const valid = CommonFunctionsApi.checkIfValid(isValid, value);
    const errorClassName = valid || errormsg == null || errormsg == "" ? "input-errormsg" : "input-errormsg visible";
    const wrapperClasses = CommonFunctionsApi.combineStrings(['input-wrapper', wrapperClassName], ' ');

    if (!valid) {
      if (type === "submit" || type === "button") {
        return (
          <div className={wrapperClasses}>
            <Input
              {...other}
              value={value}
              type={type}
              className={className}
              disabled={true}
            />
            <span className={errorClassName}>{errormsg != null ? errormsg : ""}</span>
          </div>

        )
      }
      else {
        if (className != null) {
          className += " invalid";
        }
        else {
          className = "invalid";
        }
      }
    }

    return (
      <div className={wrapperClasses}>
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
