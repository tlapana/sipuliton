function isString(value) {
  return (typeof value === 'string' || value instanceof String);
}

function isArray(value) {
  return value.constructor === Array;
}

/* Combines the strings in stringArray to one string separated by separator */
function combineStrings(stringArray, separator) {
  if (stringArray === null || stringArray === undefined) {
    return '';
  }
  if (!isArray(stringArray) || isString(stringArray)) {
    return stringArray.toString();
  }
  if (stringArray.length === 0) {
    return '';
  }
  if (stringArray.length === 1) {
    return stringArray[0];
  }

  if (separator === null || separator === undefined) {
    separator = '';
  }

  let res = stringArray[0];
  for (let i = 1; i < stringArray.length; i++) {
    let str = stringArray[i];
    if (str !== null && str !== undefined && str != '') {
      if (res === null || res === undefined || res === '') {
        res = stringArray[i];
      }
      else {
        res += separator + stringArray[i];
      }
    }
  }

  return res;
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

function checkIfValid(isValid, value) {
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
  isArray,
  combineStrings,
  checkIfTrue,
  checkIfValid,
};
