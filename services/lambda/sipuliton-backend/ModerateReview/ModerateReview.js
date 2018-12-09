
let response;
function errorHandler(err) {
    console.log(err);
    response = {
        'statusCode': 500,
        //TODO: Handle CORS in AWS api gateway settings prior to deployment
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': JSON.stringify({ 'error': "Something went wrong! " + err })
    };
    if ("statusCode" in err) {
        response['statusCode'] = err['statusCode'];
    }
    if ("error" in err) {
        response['body'] = JSON.stringify({ 'error': err['error'] });
    }
    return response;
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

        if (event.body !== null && event.body !== undefined) {
            console.log("Processing")
            let body = JSON.parse(event.body)

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

            const currentTime = new Date(Date.now()).toISOString();
            
            // Check if review is accepted or rejected and build queries
            let newStatus;
            if (body.action == "accept"){
                console.log("Review was accepted")
                newStatus = 1
                var acceptLogQuery = `
                INSERT INTO review_accept_log (restaurant_id, poster_id, review_posted, accepter_id, accepted)
                VALUES ($1, $2, $3, $4, $5)`
                const resAccept = await client.query(
                    acceptLogQuery, [body.restaurantId, body.posterId, body.reviewPosted, body.moderatorId, currentTime ]);

            } else if (body.action == "reject"){
                console.log("Review was rejected")
                newStatus = -1
                var rejectLogQuery = `
                INSERT INTO review_reject_log (restaurant_id, poster_id, review_posted, rejecter_id, rejected, reason)
                VALUES ($1, $2, $3, $4, $5, $6)`
                const resReject = await client.query(
                    rejectLogQuery, [body.restaurantId, body.posterId, body.reviewPosted, body.moderatorId, currentTime, body.reason ]);

            } else {
                throw("Action " + body.action + " not supported.")
            }
        
            // Update review itself
            var updateQuery = "UPDATE review SET status=$4 WHERE restaurant_id=$1 AND user_id=$2 AND posted =$3";
            var resUpdate =  await client.query(
                updateQuery, [body.restaurantId, body.posterId, body.reviewPosted, newStatus]);
            await client.end();
            
            response = {
                'statusCode': 200,
                //TODO: Handle CORS in AWS api gateway settings prior to deployment
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                }

            }  
        } else {
            throw("Body missing from the request")
        }

    


    } catch (err) {
        console.error(err);
        return errorHandler({err});
    }

    console.log(response)
    return response
};
