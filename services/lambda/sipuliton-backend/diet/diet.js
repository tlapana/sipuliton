
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

async function getOwnUserId(client, event) {
    const AWS = require('aws-sdk');
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: 'eu-central-1' });
    //const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    //console.log("user sub:" + userSub);
    return 0;
    return null;
}

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

function hasParam(varStr, event) {
    if (event[varStr] && event[varStr] !== "") {
        return true;
    } else if (event.body && event.body !== "") {
        var body = JSON.parse(event.body);
        if (body[varStr] && body[varStr] !== "") {
            return true;
        }
    } else if (event.queryStringParameters && event.queryStringParameters[varStr] && event.queryStringParameters[varStr] !== "") {
        return true;
    } else if (event.multiValueHeaders && event.multiValueHeaders[varStr] && event.multiValueHeaders[varStr] != "") {
        return true;
    } else if (event.headers && event.headers[varStr] && event.headers[varStr] != "") {
        return true;
    }
    return false;
}

function parseIntParam(varStr, event) {
    var val = parseParam(varStr, event);
    var parsed = parseInt(val);
    if (isNaN(parsed)) {
        return null;
    }
    return parsed;
}

Object.prototype.isEmpty = function () {
    for (var key in this) {
        if (this.hasOwnProperty(key))
            return false;
    }
    return true;
}

async function getLanguage(client, language) {
    res = await client.query(
        `SELECT language_id
        FROM languages
        WHERE languages.iso2 = $1`,
        [language]);
    if (res.rowCount == 0) {
        client.end();
        throw {
            'statusCode': 400,
            'error': "No language found"
        }
    }
    if (res.rowCount >= 2) {
        client.end();
        throw {
            'statusCode': 500,
            'error': "Something is broken, returning 2 or more languages"
        }
    }
    return res.rows[0]['language_id'];
}


// start of module functions


async function getGroups(client, languageId, alternativeLanguageId) {
    const res = await client.query(
        `SELECT name_join.food_group_id, name, array_agg(food_group_id2) as groups
        FROM (SELECT food_group.food_group_id, name
            FROM food_group, food_group_name
            WHERE food_group.food_group_id = food_group_name.food_group_id AND (
                language_id = $1 OR (language_id = $2 AND food_group.food_group_id NOT IN (
                    SELECT food_group.food_group_id
                    FROM food_group, food_group_name
                    WHERE food_group.food_group_id = food_group_name.food_group_id AND
                    language_id = $1 AND name != ''
                )
            ))
        ) AS name_join
        LEFT JOIN food_group_groups ON name_join.food_group_id = food_group_groups.food_group_id 
        GROUP BY name_join.food_group_id, name
        ORDER BY name`,
        [languageId, alternativeLanguageId]);
    if (res.rowCount > 0) {
        console.log([languageId, alternativeLanguageId]);
        console.log(res.rows);
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getPresetDiets(client, languageId, alternativeLanguageId) {
    const res = await client.query(
        `SELECT name_join.global_diet_id, name, array_agg(food_group_id) as groups
        FROM (SELECT global_diet.global_diet_id, name
            FROM global_diet, global_diet_name
            WHERE preset = TRUE AND global_diet.global_diet_id = global_diet_name.global_diet_id AND (
                language_id = $1 OR (language_id = $2 AND global_diet.global_diet_id NOT IN (
                    SELECT global_diet.global_diet_id
                    FROM global_diet, global_diet_name
                    WHERE preset = TRUE AND global_diet.global_diet_id = global_diet_name.global_diet_id AND
                    language_id = $1 AND name != ''
                )
            ))
        ) AS name_join
        LEFT JOIN diet_groups ON name_join.global_diet_id = diet_groups.global_diet_id 
        GROUP BY name_join.global_diet_id, name
        ORDER BY name`,
        [languageId, alternativeLanguageId]);
    if (res.rowCount > 0) {
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getAllDiets(client, languageId, alternativeLanguageId) {
    const res = await client.query(
        `SELECT name_join.global_diet_id, name, array_agg(food_group_id) as groups
        FROM (SELECT global_diet.global_diet_id, name
            FROM global_diet, global_diet_name
            WHERE global_diet.global_diet_id = global_diet_name.global_diet_id AND (
                language_id = $1 OR (language_id = $2 AND global_diet.global_diet_id NOT IN (
                    SELECT global_diet.global_diet_id
                    FROM global_diet, global_diet_name
                    WHERE global_diet.global_diet_id = global_diet_name.global_diet_id AND
                    language_id = $1 AND name != ''
                )
            ))
        ) AS name_join
        LEFT JOIN diet_groups ON name_join.global_diet_id = diet_groups.global_diet_id 
        GROUP BY name_join.global_diet_id, name
        ORDER BY name`,
        [languageId, alternativeLanguageId]);
    if (res.rowCount > 0) {
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}


exports.getFoodGroupsLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();
        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
                await getLanguage(client, temp.toUpperCase());

            const alternativeLanguageId = await getLanguage(client, 'EN');

            jsonObj = await getGroups(client, languageId, alternativeLanguageId);

            response = packResponse(jsonObj);
        } finally {
            await client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


exports.getPresetDietsLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
                await getLanguage(client, temp.toUpperCase());

            const alternativeLanguageId = await getLanguage(client, 'EN');

            const jsonObj = await getPresetDiets(client, languageId, alternativeLanguageId);

            response = packResponse(jsonObj);
        } finally {
            await client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


exports.getAllDietsLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
                await getLanguage(client, temp.toUpperCase());

            const alternativeLanguageId = await getLanguage(client, 'EN');

            const jsonObj = await getAllDiets(client, languageId, alternativeLanguageId);

            response = packResponse(jsonObj);
        } finally {
            await client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};
