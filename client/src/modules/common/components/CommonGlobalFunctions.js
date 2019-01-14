function isString(value) {
  return (typeof value === 'string' || value instanceof String)
}

function checkIfTrue(boolean) {
  if (boolean != null) {
    if (typeof boolean === 'function') {
      if (boolean.length === 0 && !boolean()) {
        return false;
      }
    }
    else if (isString(boolean) && boolean.toLowerCase() === 'false') {
      return false;
    }
    else if (!boolean) {
      return false;
    }
  }

  return true;
}

function  checkIfValid(isValid, value) {
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

module.exports = {
  isString,
  checkIfTrue,
  checkIfValid
};
