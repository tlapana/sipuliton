
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

function parseParam(varStr, event) {
    if (event[varStr] && event[varStr] !== "") {
        return event[varStr];
    } else if (event.body && event.body !== "") {
        var body = JSON.parse(event.body);
        if (body[varStr] && body[varStr] !== "") {
            return body[varStr];
        }
    } else if (event.queryStringParameters && event.queryStringParameters[varStr] && event.queryStringParameters[varStr] !== "") {
        return event.queryStringParameters[varStr];
    } else if (event.multiValueHeaders && event.multiValueHeaders[varStr] && event.multiValueHeaders[varStr] != "") {
        return event.multiValueHeaders[varStr].join(" and ");
    } else if (event.headers && event.headers[varStr] && event.headers[varStr] != "") {
        return event.headers[varStr];
    }
    return null;
}

function getCountryName(client, countryId, languageId) {
    if (countryId && countryId !== "") {
        var res = await client.query(
            `SELECT name
            FROM country_name
            WHERE country_id = $1 AND language_id = $2`,
            [countryId, languageId]);
        if (res.rowCount == 0) {
            res = await client.query(
                `SELECT name
                FROM country_name, languages
                WHERE country_id = $1 AND languages.iso2 = 'EN' AND country.language_id = languages.language_id`,
                [countryId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
            }
        }
        if (res.rowCount >= 2) {
            await client.end();
            throw {
                'statusCode': 500,
                'error': "Something is broken, returning 2 or more countries\r\n"
            }
        }
        return res.rows[0]['name'];
    }
    return null
}

function getCityName(client, cityId, languageId) {
    if (cityId && cityId !== "") {
        var res = await client.query(
            `SELECT name
            FROM city_name
            WHERE country_id = $1 AND language_id = $2`,
            [cityId, languageId]);
        if (res.rowCount == 0) {
            res = await client.query(
                `SELECT name
                FROM city_name, languages
                WHERE country_id = $1 AND languages.iso2 = 'EN' AND country.language_id = languages.language_id`,
                [cityId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
            }
        }
        if (res.rowCount >= 2) {
            await client.end();
            throw {
                'statusCode': 500,
                'error': "Something is broken, returning 2 or more countries\r\n"
            }
        }
        return res.rows[0]['name'];
    }
    return null
}

function getUserdata(client, userid) {
    const baseRes = await client.query(
        `SELECT username, email, display_name, gender, image_url, birth_year, birth_month,
                description, country_id, city_id, countries AS countries_visited,
                cities AS cities_visited, reviews, thumbs_up, thumbs_down,
                thumbs_up_given, thumbs_down_given, activity_level, last_active
        FROM user_login
        INNER JOIN user_profile ON user_login.user_id = user_profile.user_id
        INNER JOIN user_stats ON user_login.user_id = user_stats.user_id
        WHERE user_login.user_id = $1`,
        [userId]);
    if (baseRes.rowCount == 0) {
        await client.end();
        throw {
            'statusCode': 400,
            'error': "No user found\r\n"
        }
    }
    if (baseRes.rowCount >= 2) {
        await client.end();
        throw {
            'statusCode': 500,
            'error': "Something is broken, returning 2 or more users\r\n"
        }
    }
    jsonObj = JSON.parse(JSON.stringify(baseRes.rows));
    return jsonObj;
}

function fetchUser(userId, ownUserId, languageId) {
    var pg = require("pg");
    if (!Number.isInteger(userId)) {
        throw {
            'statusCode': 400,
            'error': "Invalid user id\r\n"
        }
    }
    if (!languageId || !Number.isInteger(languageId)) {
        throw {
            'statusCode': 400,
            'error': "Invalid language id\r\n"
        }
    }

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
                'error': "Failed to connect to database\r\n" + err
            }
        }
    });

    jsonObj = getUserdata(client, userId);

    jsonObj['country_name'] = getCountryName(client, jsonObj['country_id'], languageId);
    delete jsonObj['country_id']; 

    jsonObj['city_name'] = getCityName(client, jsonObj['city_id'], languageId);
    delete jsonObj['city_id'];

    await client.end();

    jsonObj['own_profile'] = false;
    if (ownUserId) {
        if (Number.isInteger(ownUserId)) {
            jsonObj['own_profile'] = (ownUserId === userId);
        }
        else {
            throw {
                'statusCode': 400,
                'error': "own user id invalid\r\n"
            }
        }
    }

    // ret.data contains IP of request's sender
    // var conn = "postgres://sipuliton:sipuliton@localhost/sipuliton";
    // var client = new pg.Client(conn);
    response = {
        'statusCode': 200,
        //TODO: Handle CORS in AWS api gateway settings prior to deployment
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': JSON.stringify({ jsonObj })
    };
}

exports.lambdaHandler = async (event, context) => {
    try {
        const userId = parseParam("userId", event);
        //TODO: get user id from cognito if not requesting specified user
        if (!userId) {
            userId = 0;
        }
        //TODO: get own user id using cognito
        const ownUserId = userId;
        //TODO: possibly query language id if not saved as id in cookies
        const languageId = parseParam("language", event);

        return fetchUser(userId, ownUserId, languageId);
        
    } catch (err) {
        //TODO: Remove += err before deployment
        response = {
            'statusCode': 500,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': { 'error' : "Something went wrong\r\n" + JSON.stringify(err) }
        };
        if (err.has('statusCode')) {
            response['statusCode'] = err['statusCode'];
        }
        if (err.has('error')) {
            response['body'] = { 'error' : err['error'] };
        }
        console.log(err);
        return response;
    }

    return response
};
