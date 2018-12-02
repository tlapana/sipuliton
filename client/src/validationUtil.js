/* 
  This file contains general validation methods
*/
import config from "./config";


export function validateEmail(email) {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return email != null && 
    email.length >= config.login.EMAIL_MIN_LENGTH && 
    email.length <= config.login.EMAIL_MAX_LENGTH && 
    re.test(email);
}

export function validateUsername(username) {
  return username != null && 
    username.length >= config.login.USERNAME_MIN_LENGTH && 
    username.length <= config.login.USERNAME_MAX_LENGTH;
}

export function validatePassword(password) {
  const reLowerCase = /[a-z]/;
  const reNumber = /[0-9]/;
  return password != null && 
    password.length >= config.login.PASSWORD_MIN_LENGTH && 
    password.length <= config.login.PASSWORD_MAX_LENGTH && 
    reLowerCase.test(password) && 
    reNumber.test(password);
}
