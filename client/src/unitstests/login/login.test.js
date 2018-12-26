const LoginApi = require('../../modules/login/components/LoginGlobalFunctions');

const config =  {
  cognito: {
     REGION: "eu-central-1",
     USER_POOL_ID: "eu-central-1_RcdrXwM4n",
     APP_CLIENT_ID: "6shik8f5c8k0dc7oje4qumn6fd",
     IDENTITY_POOL_ID: "eu-central-1:422edfe5-0641-46f1-b3b7-8b8e12814cd4",
   },
   google: {
     CLIENT_ID: "1007417390749-o1tbmd4dfnn4ak51uh1trqimtgp15k0v.apps.googleusercontent.com",
     API_KEY: "AIzaSyDlm-ECBXdhQ99097TQ2jlYwigkpx5Ti8Y"
   },
   facebook: {
     APP_ID: "1523866137714690"
   },
};

test('GetCurrentAuthUser test', () => {
  LoginApi.configure(config);
  expect(LoginApi.getCurrentAuthUser()).toBe(undefined);
});

test('sign in user', () => {
  LoginApi.configure(config);
  expect(LoginApi.signIn("","testuser1").succeeded).toBe(false);
  expect(LoginApi.signIn("","").succeeded).toBe(false);
  expect(LoginApi.signIn("testuser","").succeeded).toBe(false);
  expect(LoginApi.signIn("TestUser1","").succeeded).toBe(false);
  expect(LoginApi.signIn("TestUser1","testuser1").succeeded).toBe(true);
});
