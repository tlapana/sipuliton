
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
        console.log("TRYING")
        // Result of this query will later go to the returned json
        //TODO: fix reliability typo in database
        var collectLandingPage = `
        SELECT restaurant.restaurant_id as restaurant_id, name, email, website, street_address, geo_location, 
               rating_overall,
               rating_realiability AS rating_reliability,
               rating_variety,
               rating_service_and_quality 
        FROM restaurant INNER JOIN restaurant_diet_stats
        ON restaurant.restaurant_id=restaurant_diet_stats.restaurant_id
        ORDER BY rating_overall
        LIMIT 10;
        `;
        var pg = require("pg");
        var conn = "postgres://sipuliton:sipuliton@sipulitonpostgres_postgres_1:5432/sipuliton";
        var client = new pg.Client(conn);
        console.log("Client created");
        console.log(client);
        const result = await client.connect((err) => {
            console.log("Connecting")
            if (err){
                console.log("Failed to connect client")
                console.log(err)
            }
            console.log("Running query")
            client.query(collectLandingPage, [], (err, res) => {
                if(err){
                    console.log('error running query', err);
                }
                console.log("Parsing result");
                var jsonString = JSON.stringify(res.rows);
                console.log(jsonString);
                var jsonObj = JSON.parse(jsonString);
                console.log("Building response")
                response = {
                    'statusCode': 200,
                    //TODO: Handle CORS in AWS api gateway settings prior to deployment
                    'headers': {
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': '{"jsonString": "test"}'
                };
                console.log(response)

            });
            console.log("Query done");
            console.log(response);
            
        });
        await client.end();
        console.log("Postgres part done")
        

    } catch (err) {
        console.log("Catched!")
        console.log(err);
        return err;
    }
    console.log("Returning response")
    console.log(response)
    return response
};
