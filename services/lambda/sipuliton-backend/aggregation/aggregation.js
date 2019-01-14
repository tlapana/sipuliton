
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

// shared functions

async function getPsqlClient() {
    var pg = require("pg");
    //TODO: Before deploying, change to a method for fetching Amazon RDS credentials
    var conn = "postgres://sipuliton:sipuliton@sipuliton_postgres_1/sipuliton";
    const client = new pg.Client(conn);
    await client.connect((err) => {
        if (err) {
            //TODO: Remove + err before deployment
            console.error("Failed to connect client");
            console.error(err);
            throw {
                'statusCode': 500,
                'error': "Failed to connect to database" + err
            }
        }
    });
    return client
}

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

function packResponse(jsonObj) {
    response = {
        'statusCode': 200,
        //TODO: Handle CORS in AWS api gateway settings prior to deployment
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': JSON.stringify(jsonObj)
    };
    return response;
}

exports.aggregationLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY restaurant_diet_stats`);
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY restaurant_diet_filter`);
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY recursive_diets`);
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY review_weights`);
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY weighted_restaurant_diet_stats`);
            await client.query(`UPDATE user_stats
                                SET reviews = other.review_count
                                FROM (SELECT user_id, COUNT(*) as review_count
                                    FROM reviews
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.user_id`);
            await client.query(`UPDATE user_stats
                                SET thumbs_up_given = other.thumbs
                                FROM (SELECT thumber_id, COUNT(*) as thumbs
                                    FROM thumbs
                                    WHERE up = TRUE
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.thumber_id`);
            await client.query(`UPDATE user_stats
                                SET thumbs_down_given = other.thumbs
                                FROM (SELECT thumber_id, COUNT(*) as thumbs
                                    FROM thumbs
                                    WHERE up = FALSE
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.thumber_id`);
            await client.query(`UPDATE user_stats
                                SET thumbs_up = other.thumbs
                                FROM (SELECT user_id, COUNT(*) as thumbs
                                    FROM thumbs, review
                                    WHERE up = TRUE AND review.review_id = thumbs.review_id
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.user_id`);
            await client.query(`UPDATE user_stats
                                SET thumbs_down = other.thumbs
                                FROM (SELECT user_id, COUNT(*) as thumbs
                                    FROM thumbs, review
                                    WHERE up = FALSE AND review.review_id = thumbs.review_id
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.user_id`);
            await client.query(`UPDATE user_stats
                                SET cities = other.cities
                                FROM (SELECT user_id, COUNT(city_id) as cities
                                    FROM reviews, restaurant
                                    WHERE review.restaurant_id = restaurant.restaurant_id
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.user_id`);
            await client.query(`UPDATE user_stats
                                SET cities = other.countries
                                FROM (SELECT user_id, COUNT(country_id) as countries
                                    FROM reviews, restaurant
                                    WHERE review.restaurant_id = restaurant.restaurant_id
                                    GROUP BY user_id) as other
                                WHERE user_stats.user_id = other.user_id`);

            response = packResponse('message' : 'Operation completed succesfully');
        } finally {
            await client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};
