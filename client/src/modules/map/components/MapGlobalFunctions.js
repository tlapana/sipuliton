//This is global api for the map functions.

//Center parameter which are used in this api functions.
var center = [1,1];

//Distance formatter function which handles map slider value converting.
function distanceFormatter(v) {
  if(typeof v === "number"){
    v = v/1000;
    v = v.toFixed(2);
  }
  else{
    v = 0;
  }
  return `${v} km`;
}

//Sorting functions for sorting restaurants based on their location.
function sortByDistanceToCenter(){
  return function(a,b){
    var powAx = Math.pow(a.position[0]-center[0],2);
    var powAy = Math.pow(a.position[1]-center[1],2);
    var powBx = Math.pow(b.position[0]-center[0],2);
    var powBy = Math.pow(b.position[1]-center[1],2);
    var distToA = Math.sqrt(powAx+powAy)
    var distToB = Math.sqrt(powBx+powBy)
    if( distToA < distToB){
      return -1;
    }
    if(distToA > distToB){
      return 1;
    }
    return 0;
  }
}

//Sorting function for sorting based on restaurant overall rating.
function sortByOverallRating(){
  return function(a,b){
    if( a.overallRating < b.overallRating){
      return 1;
    }
    if(a.overallRating > b.overallRating){
      return -1;
    }
    return 0;
  }
}

//Sorting function for sorting based on restaurant pricing.
function sortByPricing(){
  return function(a,b){
    if( a.pricingRating < b.pricingRating){
      return -1;
    }
    if(a.pricingRating > b.pricingRating){
      return 1;
    }
    return 0;
  }
}

//Set new center to global api
function setNewCenter(newCenter){
  if(typeof newCenter === "object"){
    center = newCenter;
  }
}

//Get global api center.
function getCenter(){
  return center;
}

//Method gets todays restaurant opening hours from restaurant data.
function getTodayOpeningHours(restaurantInfo){
  var d = new Date();
  var n = d.getDay()
  var todayOpenHours = "";
  if(n === 0){
    todayOpenHours = restaurantInfo.openSun
  }
  if(n === 1){
    todayOpenHours = restaurantInfo.openMon
  }
  if(n === 2){
    todayOpenHours = restaurantInfo.openTue
  }
  if(n === 3){
    todayOpenHours = restaurantInfo.openWed
  }
  if(n === 4){
    todayOpenHours = restaurantInfo.openThu
  }
  if(n === 5){
    todayOpenHours = restaurantInfo.openFri
  }
  if(n === 6){
    todayOpenHours = restaurantInfo.openSat
  }
  return todayOpenHours;
}

//Function parses parameters which are given to map page in url.
function parseMapUrlParametersToFilters(searchString){
  var overallRating = 0;
  var minRel = 0;
  var minVariety = 0;
  var minService = 0;
  var minPricing = 0;
  var diets = [];
  var city = "";
  var searchRadius = 10000;
  var longitude = 24.940886;
  var latitude = 60.168182;
  var filters = {};
  var variables = searchString.replace("?","");
  var varArray = variables.split("&");
  for(var i = 0; i<varArray.length; i++){
    var el = varArray[i];
    var varValPair = el.split("=");
    if(varValPair[0] === "minOverallRating"){
      overallRating = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "minReliabilityRating"){
      minRel = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "minVarietyRating"){
      minVariety = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "searchRadius"){
      searchRadius = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "minServiceAndQualityRating"){
      minService = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "minPricing"){
      minPricing = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "city"){
      city = varValPair[1];
    }
    if(varValPair[0] === "searchLongitude"){
      longitude = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "searchLatitude"){
      latitude = parseInt(varValPair[1]);
    }
    if(varValPair[0] === "searchDiets"){
      diets = varValPair[1].split(',');
    }
  }
  filters = {
    overallRating:overallRating,
    minRel:minRel,
    minVariety:minVariety,
    searchRadius:searchRadius,
    minService:minService,
    minPricing:minPricing,
    city:city,
    longitude:longitude,
    latitude:latitude,
    diets:diets,
  }
  return filters;
}

// Function handles restaurant opening hour data which is fetched from backend.
function handleOpeningHour(opens,closes){
  var open = "";
  if(opens === null || closes === null){
    open = "Suljettu"
  }
  else{
    var opens_arr = opens.split(':');
    var closes_arr = closes.split(':');
    if(opens_arr.length >= 2 && closes_arr.length >= 2){
      open = opens_arr[0]+':'+opens_arr[1]+" - "+closes_arr[0]+':'+closes_arr[1]
    }
    if(opens_arr.length >= 2 && closes_arr.length < 2) {
      open = opens_arr[0]+':'+opens_arr[1]+" - "+closes
    }
    if(opens_arr.length < 2 && closes_arr.length >= 2){
      open = opens+" - "+closes_arr[0]+':'+closes_arr[1]
    }
    if(opens_arr.length < 2 && closes_arr.length < 2){
      open = opens+" - "+closes
    }
  }
  return open;
}

//Function handles rating data which is fetched from backend.
function handleRating(rating,maxRating){
  var returnRating = 0;
  if(rating === null || maxRating === null || isNaN(rating) || rating < 0){
    returnRating = 0;
  }
  else{
    if(rating >= maxRating){
      returnRating = maxRating
    }
    else{
      returnRating = rating
    }
  }
  return returnRating;
}

//Function parses data which is fetched from backend to restaurant objects.
function parseRestaurantsData(restaurantData){
  var markers = [];
  for(var i = 0; i<restaurantData.length; ++i){
    var res = restaurantData[i];
    var resObj = {
      id:res.restaurant_id,
      name:res.restaurant_name,
      city:res.city_name,
      address:res.street_address,
      overallRating:handleRating(parseInt(res.rating_overall),5),
      serviceRating:handleRating(parseInt(res.rating_service_and_quality),5),
      varietyRating:handleRating(parseInt(res.rating_variety),5),
      reliabilityRating: handleRating(parseInt(res.rating_reliability),5),
      pricingRating: handleRating(parseInt(res.pricing),3),
      website: res.website,
      email: res.email,
      openMon: handleOpeningHour(res.opens_mon,res.closes_mon),
      openTue: handleOpeningHour(res.opens_tue,res.closes_tue),
      openWed: handleOpeningHour(res.opens_wed,res.closes_wed),
      openThu: handleOpeningHour(res.opens_thu,res.closes_thu),
      openFri: handleOpeningHour(res.opens_fri,res.closes_fri),
      openSat: handleOpeningHour(res.opens_sat,res.closes_sat),
      openSun: handleOpeningHour(res.opens_sun,res.closes_sun),
      position: [res.latitude,res.longitude],
    }
    markers.push(resObj);
  }
  return markers;
}

//Function selects most suitable grey restaurants to showing.
function chooseGreyMarkers(greenMarkers,greyMarkers){
  var alreadyFoundRestaurants = [];
  for(var i = 0; i<greenMarkers.length; ++i){
    alreadyFoundRestaurants.push(greenMarkers[i].id);
  }
  greyMarkers = greyMarkers
       .filter(x => !alreadyFoundRestaurants.includes(x.id));
  if(greyMarkers === undefined){
    greyMarkers = [];
  }
  var number = 10-greenMarkers.length;
  if(greyMarkers.length > number){
    greyMarkers.sort(sortByOverallRating());
    greyMarkers = greyMarkers.slice(0,number);
  }
  return greyMarkers;
}

module.exports = {
  sortByDistanceToCenter,
  distanceFormatter,
  setNewCenter,
  getCenter,
  getTodayOpeningHours,
  parseMapUrlParametersToFilters,
  sortByOverallRating,
  sortByPricing,
  handleOpeningHour,
  parseRestaurantsData,
  handleRating,
  chooseGreyMarkers,
};
