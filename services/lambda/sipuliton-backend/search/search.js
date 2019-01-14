
let response;

// Function for checking parameters
function checkQueryParameter(queryStringParameters, paramName, defaultParamValue){
    const paramValue = queryStringParameters[paramName]
    return  paramValue != undefined ? paramValue: defaultParamValue
};

// Function for creating a WHERE statement based on parameter name 
// and its index.
function getWhereStatement(paramName, operator, paramIndex){
        return `${paramName} ${operator} $${paramIndex}`

};


// Convert degrees to radians
if (typeof(Number.prototype.toRadians) === "undefined") {
    Number.prototype.toRadians = function() {
      return this * Math.PI / 180;
    }
  }

// Returns statement for restricting restaurants by distance
function getDistanceStatement(latitude, longitude, paramIndex){
    return `ST_DISTANCE(geo_location, ST_POINT(${latitude}, ${longitude})) <= $${paramIndex}`
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {string} event.resource - Resource path.
 * @param {string} event.path - Path parameter.
 * @param {string} event.httpMethod - Incoming request's method name.
 * @param {Object} event.headers - Incoming request headers.
 * @param {Object} event.queryStringParameters - query string parameters.
 * @param {Object} event.pathParameters - path parameters.
 * @param {Object} event.stageVariables - Applicable stage variables.
 * @param {Object} event.requestContext - Request context, including authorizer-returned key-value pairs, requestId, sourceIp, etc.
 * @param {Object} event.body - A JSON string of the request payload.
 * @param {boolean} event.body.isBase64Encoded - A boolean flag to indicate if the applicable request payload is Base64-encode
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 * @param {string} context.logGroupName - Cloudwatch Log Group name
 * @param {string} context.logStreamName - Cloudwatch Log stream name.
 * @param {string} context.functionName - Lambda function name.
 * @param {string} context.memoryLimitInMB - Function memory.
 * @param {string} context.functionVersion - Function version identifier.
 * @param {function} context.getRemainingTimeInMillis - Time in milliseconds before function times out.
 * @param {string} context.awsRequestId - Lambda request ID.
 * @param {string} context.invokedFunctionArn - Function ARN.
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * @returns {boolean} object.isBase64Encoded - A boolean flag to indicate if the applicable payload is Base64-encode (binary support)
 * @returns {string} object.statusCode - HTTP Status Code to be returned to the client
 * @returns {Object} object.headers - HTTP Headers to be returned
 * @returns {Object} object.body - JSON Payload to be returned
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        // Define default parameters
        const defaultPageSize = 20
        const defaultPageNumber = 0
        const defaultMaxDistance = 10000 // in metres
        const defaultMinOverallRating = 0
        const defaultMinReliabilityRating = 0
        const defaultMinVarietyRating = 0
        const defaultMinServiceAndQualityRating = 0
        const defaultMaxPricing = 100
        const defaultDiet = [0]

        // Setting empty query string if none was provided
        if ((event.queryStringParameters == null)){
            event.queryStringParameters = {}
        }
        // Check parameters
        searchParameters = {
            generalParameters: {
                pageSize: checkQueryParameter(event.queryStringParameters, 'pageSize', defaultPageSize),
                pageNumber: checkQueryParameter(event.queryStringParameters, 'pageNumber', defaultPageNumber),
                offset: function(){
                    return Number(this.pageSize) * Number(this.pageNumber)
                },
                orderBy: checkQueryParameter(event.queryStringParameters, 'orderBy', 'trending')
            },
            restaurantParameters: {
                maxDistance: {
                    value: checkQueryParameter(event.queryStringParameters, 'maxDistance', defaultMaxDistance),
                    operator: '<='
                },
                minOverallRating: {
                    sql_name: 'rating_overall',
                    value: checkQueryParameter(event.queryStringParameters, 'minOverallRating', defaultMinOverallRating),
                    operator: '>='
                },
                minReliabilityRating: {
                    sql_name: 'rating_reliability',
                    value: checkQueryParameter(event.queryStringParameters, 'minReliabilityRating', defaultMinReliabilityRating),
                    operator: '>='
                },
                minVarietyRating: {
                    sql_name: 'rating_variety',
                    value: checkQueryParameter(event.queryStringParameters, 'minVarietyRating', defaultMinVarietyRating),
                    operator: '>='
                },
                minServiceAndQualityRating: {
                    sql_name: 'rating_service_and_quality',
                    value: checkQueryParameter(event.queryStringParameters, 'minServiceAndQualityRating', defaultMinServiceAndQualityRating),
                    operator: '>='
                },
                maxPricing: {
                    sql_name: 'pricing',
                    value: checkQueryParameter(event.queryStringParameters, 'maxPricing', defaultMaxPricing),
                    operator: '<='
                },
                cityName: {
                    sql_name: 'city_name.name',
                    value: checkQueryParameter(event.queryStringParameters, 'cityName', null),
                    operator: '='
                },
                globalDietId: {
                    sql_name: 'global_diet_id',
                    value: checkQueryParameter(event.queryStringParameters, 'globalDietId', defaultDiet),
                    operator: '='
                },
                currentLatitude: {
                    value: checkQueryParameter(event.queryStringParameters, "currentLatitude", undefined)
                },
                currentLongitude: {
                    value: checkQueryParameter(event.queryStringParameters, "currentLongitude", undefined)
                }
            }
        };
        console.log(searchParameters);

        var collectRestaurants = `
        SELECT restaurant.restaurant_id AS restaurant_id, restaurant.name as restaurant_name, email,
               city_name.name as city_name, website, street_address,
               AVG(restaurant_diet_stats.reviews) as reviews,
               AVG(restaurant_diet_stats.rating_overall) as rating_overall, AVG(restaurant_diet_stats.rating_reliability) as rating_reliability,
               AVG(restaurant_diet_stats.rating_variety) as rating_variety, AVG(restaurant_diet_stats.rating_service_and_quality) as rating_service_and_quality,
               AVG(restaurant_diet_stats.pricing) as pricing, AVG(restaurant_diet_stats.trending) as trending,
               AVG(weighted_restaurant_diet_stats.reviews) as weighted_reviews,
               AVG(weighted_restaurant_diet_stats.rating_overall) as weighted_rating_overall, AVG(weighted_restaurant_diet_stats.rating_reliability) as weighted_rating_reliability,
               AVG(weighted_restaurant_diet_stats.rating_variety) as weighted_rating_variety, AVG(weighted_restaurant_diet_stats.rating_service_and_quality) as weighted_rating_service_and_quality,
               AVG(weighted_restaurant_diet_stats.pricing) as weighted_pricing, AVG(weighted_restaurant_diet_stats.trending) as weighted_trending, latitude, longitude, 
               opens_mon, closes_mon, opens_tue, closes_tue, opens_wed, closes_wed, opens_thu, closes_thu, opens_fri, closes_fri, opens_sat, closes_sat, opens_sun, closes_sun
        FROM restaurant
            LEFT JOIN (SELECT restaurant_id, global_diet_id, COUNT(*) AS votes
                      FROM diet_vote
                      WHERE up = TRUE) AS upvotes
                ON restaurant.restaurant_id = upvotes.restaurant_id`

        var paramIndex = 1;
        var paramValues = [];
        var paramObject = searchParameters.restaurantParameters;

        paramObject = searchParameters.restaurantParameters['global_diet_id']
        values = JSON.parse(paramObject.value)
        diet_statement = 'AND ('
        for (var i = 0; i < values.length; i++) {
            diet_statement = diet_statement + getWhereStatement(paramObject.sql_name, paramObject.operator, paramIndex)
            paramIndex += 1
            paramValues.push(values[i])
            if (i+1 != values.length) {
                diet_statement = diet_statement + ' OR '
            }
        }
        diet_statement = diet_statement + ')';
        collectRestaurants = collectRestaurants + diet_statement;

        collectRestaurants = collectRestaurants + `
            LEFT JOIN (SELECT restaurant_id, global_diet_id, COUNT(*) AS votes
                      FROM diet_vote
                      WHERE up = FALSE) AS downvotes
                ON restaurant.restaurant_id = downvotes.restaurant_id` + diet_statement;
        collectRestaurants = collectRestaurants + `
            LEFT JOIN restaurant_diet_stats ON restaurant.restaurant_id = restaurant_diet_stats.restaurant_id` + diet_statement;
        collectRestaurants = collectRestaurants + `
            LEFT JOIN weighted_restaurant_diet_stats ON restaurant.restaurant_id = restaurant_diet_stats.restaurant_id` + diet_statement;
        collectRestaurants = collectRestaurants + `
            INNER JOIN city_name ON restaurant.city_id=city_name.city_id
            LEFT JOIN open_hours ON restaurant.restaurant_id=open_hours.restaurant_id
        WHERE
            city_name.language_id=0 AND  AND restaurant.restaurant_id = downvotes.restaurant_id AND

           
        `;

        for (var key in searchParameters.restaurantParameters){

            if (key == 'maxDistance'){
                var currentLatitude = searchParameters.restaurantParameters.currentLatitude.value;
                var currentLongitude = searchParameters.restaurantParameters.currentLongitude.value
                if (currentLatitude === undefined || currentLongitude === undefined){
                    throw("Max distance parameter given but no current location")
                }
                var maxDistance = searchParameters.restaurantParameters.maxDistance.value


                if (paramIndex > 1){
                    collectRestaurants = collectRestaurants + ' AND '
                }

                collectRestaurants = collectRestaurants + '\n' + getDistanceStatement(currentLatitude, currentLongitude, paramIndex)
                paramIndex += 1
                paramValues.push(maxDistance)
            } else if (key == 'cityName' && searchParameters.restaurantParameters.cityName.value == null || key == "currentLatitude" || key == "currentLongitude"){
                continue;
            } else if (key == 'global_diet_id') {
                continue;
            } else {
                if (paramIndex > 1){
                    collectRestaurants = collectRestaurants + ' AND '
                }
                paramObject = searchParameters.restaurantParameters[key]
                
                collectRestaurants = collectRestaurants + '\n' + getWhereStatement(paramObject.sql_name, paramObject.operator, paramIndex)
                paramIndex += 1
                paramValues.push(paramObject.value)
            }
            
        }
        var pageDefinition = `
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`

        paramIndex += 2;
        paramValues.push(searchParameters.generalParameters.pageSize);
        paramValues.push(searchParameters.generalParameters.offset());

        collectRestaurants = collectRestaurants +
            `GROUP BY ` +
            `restaurant_id, restaurant_name, email, ` +
            `city_name, website, street_address, rating_overall, latitude, longitude, ` +
            `opens_mon, closes_mon, opens_tue, closes_tue, opens_wed, closes_wed, opens_thu, closes_thu, opens_fri, closes_fri, opens_sat, closes_sat, opens_sun, closes_sun`

        collectRestaurants = collectRestaurants + `
           ORDER BY $${paramIndex} DESC
           ` + pageDefinition;
        paramValues.push(searchParameters.generalParameters.orderBy);
        console.log(collectRestaurants);

        var pg = require("pg");
       
        //TODO: Before deploying, change to a method for fetching Amazon RDS credentials
        var conn = "postgres://sipuliton:sipuliton@sipuliton_postgres_1/sipuliton";
        const client = new pg.Client(conn);
        await client.connect((err) => {
                console.log("Connecting")
                if (err){
                    console.error("Failed to connect client")
                    console.error(err)
                    throw err
                }
        });
        

        const res = await client.query(collectRestaurants, paramValues);
        var jsonString = JSON.stringify(res.rows);
        var jsonObj = JSON.parse(jsonString);
        await client.end();

        var bodyJSON = {
            'restaurants': jsonObj
        }

        response = {
            'statusCode': 200,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': JSON.stringify(bodyJSON)
        };


    } catch (err) {
        console.error(err);
        return err;
    }

    console.log(response);
    return response
};
