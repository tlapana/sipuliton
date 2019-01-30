
let response;

const pg = require('pg');
const AWS = require('aws-sdk');

// Database credentials
const region = 'eu-central-1';
const dbPort = 5432;
const dbUsername = 'lambda_user'; 
const dbName = 'sipuliton'; 
const dbEndpoint = 'sipulitondb.c15ehja7hync.eu-central-1.rds.amazonaws.com';

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
exports.lambdaHandler = async (event, context, cb) => {
    try {
        var signer = new AWS.RDS.Signer();
        signer.getAuthToken({ // uses the IAM role access keys to create an authentication token
          region: region,
          hostname: dbEndpoint,
          port: dbPort,
          username: dbUsername
        }, function(err, token) {
            if (err) {
                console.log(`could not get auth token: ${err}`);
                throw(err);
            } else {
                const restaurantId = event.queryStringParameters.restaurantId

                var collectRestaurantPage = `
                SELECT restaurant.restaurant_id as restaurant_id, name, email, website, street_address, geo_location, 
                    rating_overall,
                    rating_reliability,
                    rating_variety,
                    rating_service_and_quality 
                FROM restaurant LEFT JOIN restaurant_diet_stats
                ON restaurant.restaurant_id=restaurant_diet_stats.restaurant_id
                WHERE restaurant.restaurant_id = $1
                `;

                var client = new pg.Client({
                    host: dbEndpoint,
                    port: 5432,
                    user: dbUsername,
                    password: token,
                    database: dbName,
                    ssl: 'Amazon RDS'
                  });
                client.connect()
                
                client.query(collectRestaurantPage, [restaurantId], function(err, resRestaurant, fields) {
                    client.end()
                    if (err) {
                        console.log(`could not execute query: ${err}`);
                        throw(err);
                      } else {
                        var jsonString = JSON.stringify(resRestaurant.rows);
                        var jsonObjRestaurant = JSON.parse(jsonString);
                        var bodyJSON = {
                            'restaurant': jsonObjRestaurant
                        }
                    
                    response = {
                        'statusCode': 200,
                        //TODO: Handle CORS in AWS api gateway settings prior to deployment
                        'headers': {
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': JSON.stringify(bodyJSON)
                    };
                    cb(undefined, response)
                }

            });
        }
        });

    } catch (err) {
        console.error(err);
        return err;
    }

    console.log(response)
    return response
};
