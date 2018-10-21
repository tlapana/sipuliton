
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
        var collectLandingPage = "SELECT restaurant_id, rating_overall, rating_realibility, rating_variety, rating_service_and_quality FROM restaurant_diet_stats LIMIT 10";
        var pg = require("pg");

        var dummyJson = `
        {
            "restaurants":
            [
                {
                    "id": 1,
                    "name": "Ravintola 1",
                    "address": "Hämeenkatu 1",
                    "is_open": true,
                    "picture_url": "",
                    "review_written": false,
                    "rating_overall": 1.0,
                    "rating_reliability": 1.0,
                    "rating_variety": 1.0,
                    "rating_service_and_quality": 1.0
                },
                {
                    "id": 2,
                    "name": "Ravintola 2",
                    "address": "Hervanta 1",
                    "picture_url": "",
                    "is_open": true,
                    "review_written": false,
                    "rating_overall": 1.0,
                    "rating_reliability": 1.0,
                    "rating_variety": 1.0,
                    "rating_service_and_quality": 1.0
                }
            
            ]
        }
        `
        // ret.data contains IP of request's sender
        var conn = "postgres://sipuliton:sipuliton@localhost/sipuliton";
        var client = new pg.Client(conn);
        response = {
            'statusCode': 200,
            'body': dummyJson
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
