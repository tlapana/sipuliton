import React from 'react'


export default class ErrorBlock extends React.Component {
  constructor(props) {
    super(props);
    this.isString = this.isString.bind(this);
    this.checkIfTrue = this.checkIfTrue.bind(this);
  }

  isString(value) {
    return (typeof value === 'string' || value instanceof String)
  }

  checkIfTrue(boolean) {
    if (boolean != null) {
      if (typeof boolean === 'function') {
        if (boolean.length === 0 && !boolean()) {
          return false;
        }
      }
      else if (this.isString(boolean) && boolean.toLowerCase() === 'false') {
        return false;
      }
      else if (!boolean) {
        return false;
      }
    }

    return true;
  }

  render() {
    var { hidden, className, errormsg, ...other } = this.props;
    const isHidden = this.checkIfTrue(hidden) || errormsg == null || errormsg == "";

    let classes = isHidden ? "errormsg" : "errormsg visible";
    if (className != null) {
      classes += " " + className;
    }

    return (
      <div {...other} aria-hidden={isHidden} className={classes}>
        {errormsg}
      </div>
    );
  }
}
