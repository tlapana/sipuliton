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
  var index = url.search('://');
  url = url.slice(index + 3);
  index = url.search('/');
  url = url.slice(index);
  url = url.replace('/' + curLang, '/' + newLang);
  return url;
}

module.exports = {
  getAppClasses,
  parseUrlToLanguageChanging,
};
