function getAppClasses(state){
  let classes = 'app';
  if (state.theme) {
    classes += ' ' + state.theme;
  }
  if (state.isRounding) {
    classes += ' rounded';
  }
  if (state.isLoading) {
    classes += ' loading';
  }
  return classes;
}

function parseUrlToLanguageChanging(curLoc,curLang,newLang){
  var url = curLoc;
  url = url.replace(curLang, newLang);
  url = url.replace(curLang, newLang);
  var index = url.search('://');
  url = url.slice(index + 3);
  index = url.search('/');
  url = url.slice(index);
  return url;
}

module.exports = {
  getAppClasses,
  parseUrlToLanguageChanging,
};
