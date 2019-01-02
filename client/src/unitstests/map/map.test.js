const MapApi = require('../../modules/map/components/MapGlobalFunctions');

test('Format meters to km', () => {
  expect(MapApi.distanceFormatter(1000)).toBe("1.00 km");
  expect(MapApi.distanceFormatter(0)).toBe("0.00 km");
  expect(MapApi.distanceFormatter(1234,66)).toBe("1.23 km");
  expect(MapApi.distanceFormatter(1235,66)).toBe("1.24 km");
  expect(MapApi.distanceFormatter(1234,66)).toBe("1.23 km");
  expect(MapApi.distanceFormatter("testi")).toBe("0 km");
});


test('test different sort functions', () => {

  let testRestaurantData = [
    {
      id:0,
      overallRating:"3",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"1",
      reliabilityRating: "4",
      position:[0,0],
    },
    {
      id:1,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"3",
      reliabilityRating: "4",
      position: [0,5]
    },
    {
      id:2,
      overallRating:"1",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"2",
      reliabilityRating: "4",
      position: [1,0],
    },
    {
      id:3,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      reliabilityRating: "4",
      pricingRating:"2",
      position: [1,1],
    }
  ]

  let sortByDistanceToCenterExpected = [
    {
      id:1,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"3",
      reliabilityRating: "4",
      position: [0,5]
    },
    {
      id:3,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      reliabilityRating: "4",
      pricingRating:"2",
      position: [1,1],
    },
    {
      id:2,
      overallRating:"1",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"2",
      reliabilityRating: "4",
      position: [1,0],
    },
    {
      id:0,
      overallRating:"3",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"1",
      reliabilityRating: "4",
      position:[0,0],
    },
  ];
  MapApi.setNewCenter([2,4]);
  expect(testRestaurantData.sort(MapApi.sortByDistanceToCenter())).toEqual(sortByDistanceToCenterExpected);

  let sortByOverallRatingExpected = [
    {
      id:0,
      overallRating:"3",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"1",
      reliabilityRating: "4",
      position:[0,0],
    },
    {
      id:1,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"3",
      reliabilityRating: "4",
      position: [0,5]
    },
    {
      id:3,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      reliabilityRating: "4",
      pricingRating:"2",
      position: [1,1],
    },
    {
      id:2,
      overallRating:"1",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"2",
      reliabilityRating: "4",
      position: [1,0],
    },
  ]
  expect(testRestaurantData.sort(MapApi.sortByOverallRating())).toEqual(sortByOverallRatingExpected);

  let sortByPricingExpected = [
    {
      id:0,
      overallRating:"3",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"1",
      reliabilityRating: "4",
      position:[0,0],
    },
    {
      id:3,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      reliabilityRating: "4",
      pricingRating:"2",
      position: [1,1],
    },
    {
      id:2,
      overallRating:"1",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"2",
      reliabilityRating: "4",
      position: [1,0],
    },
    {
      id:1,
      overallRating:"2",
      serviceRating:"3",
      varietyRating:"3",
      pricingRating:"3",
      reliabilityRating: "4",
      position: [0,5]
    },
  ]
  expect(testRestaurantData.sort(MapApi.sortByPricing())).toEqual(sortByPricingExpected);
});


test('Set and Get Center', () => {
  MapApi.setNewCenter([1000,100]);
  expect(MapApi.getCenter()).toEqual([1000,100]);
  MapApi.setNewCenter([1,100]);
  expect(MapApi.getCenter()).toEqual([1,100]);
});

test('Get today opening hours', () => {
  var restaurantInfo = {
    openMon:"",
    openTue:"",
    openWed:"",
    openThu:"",
    openFri:"",
    openSat:"",
    openSun:"",
  };
  expect(MapApi.getTodayOpeningHours(restaurantInfo)).toBe("");
  restaurantInfo = {
    openMon:"Suljettu",
    openTue:"Suljettu",
    openWed:"Suljettu",
    openThu:"Suljettu",
    openFri:"Suljettu",
    openSat:"Suljettu",
    openSun:"Suljettu",
  };
  expect(MapApi.getTodayOpeningHours(restaurantInfo)).toBe("Suljettu");
});

test('Map url filters parsing', () => {
  var query = "";
  var expectedResult = {
    overallRating: 0,
    minRel: 0,
    minVariety: 0,
    minService: 0,
    minPricing: 0,
    diets: [],
    city: "",
    searchRadius: 10000,
    longitude:24.940886,
    latitude:60.168182,
  };
  expect(MapApi.parseMapUrlParametersToFilters(query)).toEqual(expectedResult);
  var query = "?minOverallRating=3";
  var expectedResult = {
    overallRating: 3,
    minRel: 0,
    minVariety: 0,
    minService: 0,
    minPricing: 0,
    diets: [],
    city: "",
    searchRadius: 10000,
    longitude:24.940886,
    latitude:60.168182,
  };
  expect(MapApi.parseMapUrlParametersToFilters(query)).toEqual(expectedResult);
  query = "?minOverallRating=3&minReliabilityRating=2&minVarietyRating=1&searchRadius=1000&minServiceAndQualityRating=1&minPricing=1&city=Tampere&searchLongitude=1&searchLatitude=1&searchDiets=test test,test2,test3";
  expectedResult = {
    overallRating: 3,
    minRel: 2,
    minVariety: 1,
    minService: 1,
    minPricing: 1,
    diets: ["test test","test2","test3"],
    city: "Tampere",
    searchRadius: 1000,
    longitude:1,
    latitude:1,
  };
  expect(MapApi.parseMapUrlParametersToFilters(query)).toEqual(expectedResult);
});

test('Handle opening hours', () => {
  expect(MapApi.handleOpeningHour("10:00:00","11:00:00")).toBe("10:00 - 11:00");
  expect(MapApi.handleOpeningHour("10:00:00",null)).toBe("Suljettu");
  expect(MapApi.handleOpeningHour(null,"11:00:00")).toBe("Suljettu");
  expect(MapApi.handleOpeningHour("8:00","12:00")).toBe("8:00 - 12:00");
  expect(MapApi.handleOpeningHour("10","11")).toBe("10 - 11");
  expect(MapApi.handleOpeningHour("10:00","11")).toBe("10:00 - 11");
  expect(MapApi.handleOpeningHour("10","11:00")).toBe("10 - 11:00");
});

test('Handle ratings', () => {
  expect(MapApi.handleRating(1,3)).toBe(1);
  expect(MapApi.handleRating(2,null)).toBe(0);
  expect(MapApi.handleRating(null,3)).toBe(0);
  expect(MapApi.handleRating(5,5)).toBe(5);
  expect(MapApi.handleRating(6,4)).toBe(4);
  expect(MapApi.handleRating(7,5)).toBe(5);
  expect(MapApi.handleRating(2,3)).toBe(2);
});

test('Parse restaurant data', () => {
  let exampleRestaurantData = [
    {
      restaurant_id:0,
      restaurant_name:"Eka",
      city_name:"Hervanta",
      street_address:"Ravintolan 1 osoite",
      rating_overall:"2",
      rating_service_and_quality:"3",
      rating_variety:"3",
      pricing:"3",
      rating_reliability: "4",
      website: "www.eka.fi",
      email: "eka@eka.fi",
      opens_mon:"9:00:00",
      opens_tue:"9:00:00",
      opens_wed:"9:00:00",
      opens_thu:"9:00:00",
      opens_fri:"9:00:00",
      opens_sat:"8:00:00",
      opens_sun:"10:00:00",
      closes_mon:"9:00:00",
      closes_tue:"9:00:00",
      closes_wed:"9:00:00",
      closes_thu:"9:00:00",
      closes_fri:"9:00:00",
      closes_sat:"8:00:00",
      closes_sun:"10:00:00",
      latitude:61.454239,
      longitude:23.849175,
    },
    {
      restaurant_id:1,
      restaurant_name:"Eka",
      city_name:"Hervanta",
      street_address:"Ravintolan 1 osoite",
      rating_overall:"5",
      rating_service_and_quality:"7",
      rating_variety:"5",
      pricing:"9",
      rating_reliability: null,
      website: "www.eka.fi",
      email: "eka@eka.fi",
      opens_mon:"9:00:00",
      opens_tue:null,
      opens_wed:null,
      opens_thu:"9:00:00",
      opens_fri:"9:00:00",
      opens_sat:"8:00:00",
      opens_sun:"10:00",
      closes_mon:"9",
      closes_tue:"9:00:00",
      closes_wed:"9:00:00",
      closes_thu:"9:00:00",
      closes_fri:"9:00:00",
      closes_sat:"8:00:00",
      closes_sun:"10:00:00",
      latitude:61.454239,
      longitude:23.849175,
    }
  ]
  let expectedRestaurantData = [
    {
      id:0,
      name:"Eka",
      city:"Hervanta",
      address:"Ravintolan 1 osoite",
      overallRating:2,
      serviceRating:3,
      varietyRating:3,
      reliabilityRating: 4,
      pricingRating: 3,
      website: "www.eka.fi",
      email: "eka@eka.fi",
      openMon: "9:00 - 9:00",
      openTue: "9:00 - 9:00",
      openWed: "9:00 - 9:00",
      openThu: "9:00 - 9:00",
      openFri: "9:00 - 9:00",
      openSat: "8:00 - 8:00",
      openSun: "10:00 - 10:00",
      position: [61.454239,23.849175],
    },
    {
      id:1,
      name:"Eka",
      city:"Hervanta",
      address:"Ravintolan 1 osoite",
      overallRating:5,
      serviceRating:5,
      varietyRating:5,
      reliabilityRating:0,
      pricingRating: 3,
      website: "www.eka.fi",
      email: "eka@eka.fi",
      openMon: "9:00 - 9",
      openTue: "Suljettu",
      openWed: "Suljettu",
      openThu: "9:00 - 9:00",
      openFri: "9:00 - 9:00",
      openSat: "8:00 - 8:00",
      openSun: "10:00 - 10:00",
      position: [61.454239,23.849175],
    }
  ]
  expect(MapApi.parseRestaurantsData(exampleRestaurantData)).toEqual(expectedRestaurantData);
});

test('Grey marker selecting', () => {
  let exampleGreenMarks = [
    {
      id:0,
      overallRating:1,
    },
    {
      id:1,
      overallRating:2,
    },
    {
      id:2,
      overallRating:4,
    },
    {
      id:3,
      overallRating:3,
    },
    {
      id:4,
      overallRating:1,
    },
    {
      id:5,
      overallRating:2,
    }
  ]
  let exampleGreyMarks = [
    {
      id:0,
      overallRating:1,
    },
    {
      id:1,
      overallRating:2,
    },
    {
      id:6,
      overallRating:1,
    },
    {
      id:7,
      overallRating:3,
    },
    {
      id:8,
      overallRating:4,
    },
    {
      id:9,
      overallRating:2,
    },
    {
      id:10,
      overallRating:3,
    },
    {
      id:11,
      overallRating:5,
    },
    {
      id:12,
      overallRating:3,
    },
    {
      id:13,
      overallRating:4,
    }
  ];
  let expectedGreyMarks = [
    {
      id:11,
      overallRating:5,
    },
    {
      id:8,
      overallRating:4,
    },
    {
      id:13,
      overallRating:4,
    },
    {
      id:7,
      overallRating:3,
    },
  ]
  expect(MapApi.chooseGreyMarkers(exampleGreenMarks,exampleGreyMarks)).toEqual(expectedGreyMarks);
});
