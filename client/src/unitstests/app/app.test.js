const AppApi = require('../../modules/app/components/AppGlobalFunctions');

test('Get app classes', () => {
  var state = {
    theme:"blue",
    isRounding:true,
    isLoading:true,
  }
  expect(AppApi.getAppClasses(state)).toBe("app blue rounded loading");
  var state = {
    theme:"red",
    isRounding:true,
    isLoading:false,
  }
  expect(AppApi.getAppClasses(state)).toBe("app red rounded");
  var state = {
    theme:"red",
    isRounding:false,
    isLoading:true,
  }
  expect(AppApi.getAppClasses(state)).toBe("app red loading");
  var state = {
    theme:"red",
    isRounding:false,
  }
  expect(AppApi.getAppClasses(state)).toBe("app red");
  var state = {
    theme:"red",
  }
  expect(AppApi.getAppClasses(state)).toBe("app red");
  var state = {
  }
  expect(AppApi.getAppClasses(state)).toBe("app");
  var state = {
    isRounding:false,
  }
  expect(AppApi.getAppClasses(state)).toBe("app");
  var state = {
    isRounding:false,
    isLoading:false,
  }
  expect(AppApi.getAppClasses(state)).toBe("app");
  var state = {
    isRounding:true,
    isLoading:false,
  }
  expect(AppApi.getAppClasses(state)).toBe("app rounded");
  var state = {
    isRounding:true,
    isLoading:true,
  }
  expect(AppApi.getAppClasses(state)).toBe("app rounded loading");
  var state = {
    isRounding:false,
    isLoading:true,
  }
  expect(AppApi.getAppClasses(state)).toBe("app loading");
});

test('Parse url to language changing', () => {
  var curLoc = "http://Sipuliton.fi/fi/About";
  var curLang = "fi";
  var newLang = "en";
  expect(AppApi.parseUrlToLanguageChanging(curLoc,curLang,newLang)).toBe("/en/About");
  var curLoc = "http://Sipuliton.fi/en/About";
  var curLang = "en";
  var newLang = "en";
  expect(AppApi.parseUrlToLanguageChanging(curLoc,curLang,newLang)).toBe("/en/About");
  var curLoc = "http://Sipuliton.fi/en/About";
  var curLang = "en";
  var newLang = "fi";
  expect(AppApi.parseUrlToLanguageChanging(curLoc,curLang,newLang)).toBe("/fi/About");
  var curLoc = "http://Sipuliton.fi/fi/About";
  var curLang = "fi";
  var newLang = "";
  expect(AppApi.parseUrlToLanguageChanging(curLoc,curLang,newLang)).toBe("//About");
  var curLoc = "http://localhost:3000/fi/About";
  var curLang = "fi";
  var newLang = "en";
  expect(AppApi.parseUrlToLanguageChanging(curLoc,curLang,newLang)).toBe("/en/About");
})
