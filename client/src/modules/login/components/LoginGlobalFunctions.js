const AuthApi = require('aws-amplify');

var userLoggedIn = false;
var authenticatedUserData = {};

function configure(config){
  AuthApi.Auth.configure({
    Auth: {
      mandatorySignIn: false,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    federated: {
      google_client_id: config.google.CLIENT_ID,
      facebook_app_id: '',
      amazon_client_id: ''
    }
  })
}

function setUserData(userData){
  authenticatedUserData = userData;
}

function getUserData(){
  return authenticatedUserData;
}

function setUserLoggedInStatus(newUserLoggedIn){
  console.log(userLoggedIn);
  userLoggedIn = newUserLoggedIn;
  console.log(userLoggedIn)
}

function getUserLoggedInStatus(){
  return userLoggedIn;
}

function getCurrentAuthUser(){
  var authUser = {authenticated:false};
  AuthApi.Auth.currentAuthenticatedUser()
      .then(user => {
        setUserData(user);
        setUserLoggedInStatus(true);
      })
      .catch(err => {
        console.log(err);
        setUserData({});
        setUserLoggedInStatus(false);
      });
  return getUserData();
}

function logout(){
    AuthApi.Auth.signOut()
        .then(data =>
          {
            setUserLoggedInStatus(false);
            setUserData({});
          })
        .catch(err => {
          console.log(err);
        });
  }

function signIn(username,password){
  if(username !== "" && password !== ""){
    AuthApi.Auth.signIn(username, password)
      .then(user => {
        /* If user needs to set new password this will automatically set old
           password as a new password and after that tries to log user in. */
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          user.completeNewPasswordChallenge(password).then(s => {
            AuthApi.Auth.signIn(username, password).then(s => {
              console.log(user.username + " logged in!");
              setUserLoggedInStatus(true);
              //this.setState({ loggingSucceeded: true, isLoading: false });
            }).catch(e => {
              setUserLoggedInStatus(false);
            });
          }).catch(err => {
            setUserLoggedInStatus(false);
          });
        }
        else {
          console.log(user.username + " logged in!");
          setUserLoggedInStatus(true);
        }
    })
    .catch(e => {
      console.log(e);
      setUserLoggedInStatus(false);
    });
  }
  return getUserLoggedInStatus();
}

module.exports = {
  getCurrentAuthUser,
  signIn,
  configure,
  getUserLoggedInStatus
};
