
let response;

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
        // Result of this query will later go to the returned json
        var collectProfile = "";
        var pg = require("pg");

        var dummyJson = `
        {  
	   "username": "testuser",
	   "email": "testuser@sipuliton.fi",
           "display_name": "User's Display Name",
	   "gender": "M",
	   "birth_year": 1950,
	   "birth_month": null,
	   "description": "User's optional description text",
	   "country_name": "Finland",
           "city_name": "Tampere",
	   "countries_visited": 1,
	   "cities_visited": 1,
	   "reviews": 100,
	   "thumbs_up": 10,
	   "thumbs_down", 20,
	   "thumbs_up_given": 100,
	   "humbs_down_given": 300,
	   "activity_level": 100,
	   "last_active": null
			 

        }
        `
        // ret.data contains IP of request's sender
        var conn = "postgres://sipuliton:sipuliton@localhost/sipuliton";
        var client = new pg.Client(conn);
        response = {
            'statusCode': 200,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': dummyJson
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
