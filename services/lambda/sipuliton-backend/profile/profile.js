
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

// shared functions

async function getOwnUserId(client, event) {
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: 'eu-central-1' });
    //const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    //console.log("user sub:" + userSub);
    return 0;
    return null;
}

async function getToken() {
    var signedToken;
    var signer = new AWS.RDS.Signer();
    await signer.getAuthToken({ // uses the IAM role access keys to create an authentication token
        region: region,
        hostname: dbEndpoint,
        port: dbPort,
        username: dbUsername
    }, function(err, token) {
        if (err) {
            console.log(`could not get auth token: ${err}`);
            throw(err);
        } else {
            signedToken = token
            return token
        }
    });
    return signedToken
}

async function getPsqlClient() {

    var token = await getToken();
    //TODO: Before deploying, change to a method for fetching Amazon RDS credentials
    var conn = "postgres://sipuliton:sipuliton@sipuliton_postgres_1/sipuliton";

    var client = new pg.Client({
        host: dbEndpoint,
        port: 5432,
        user: dbUsername,
        password: token,
        database: dbName,
        ssl: 'Amazon RDS'
      });

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


async function getCountryName(client, countryId, languageId, alternativeLanguageId) {
    if (countryId && countryId !== "") {
        var res = await client.query(
            `SELECT name
            FROM country_name
            WHERE country_id = $1 AND language_id = $2`,
            [countryId, languageId]);
        if (res.rowCount == 0) {
            res = await client.query(
                `SELECT name
                FROM country_name
                WHERE country_id = $1 AND language_id = $2`,
                [countryId, alternativeLanguageId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
                return null;
            }
        }
        if (res.rowCount >= 2) {
            client.end();
            throw {
                'statusCode': 500,
                'error': "Something is broken, returning 2 or more countries"
            }
        }
        return res.rows[0]['name'];
    }
    return null
}

async function getCityName(client, cityId, languageId, alternativeLanguageId) {
    if (cityId && cityId !== "") {
        var res = await client.query(
            `SELECT name
            FROM city_name
            WHERE city_id = $1 AND language_id = $2`,
            [cityId, languageId]);
        if (res.rowCount == 0) {
            res = await client.query(
                `SELECT name
                FROM city_name
                WHERE city_id = $1 AND language_id = $2`,
                [cityId, alternativeLanguageId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
                return null;
            }
        }
        if (res.rowCount >= 2) {
            client.end();
            throw {
                'statusCode': 500,
                'error': "Something is broken, returning 2 or more countries"
            }
        }
        return res.rows[0]['name'];
    }
    return null;
}

async function getUserdata(client, userId) {
    const res = await client.query(
        `SELECT username, email, display_name, gender, image_url, birth_year, birth_month,
                description, country_id, city_id, countries AS countries_visited,
                cities AS cities_visited, reviews, thumbs_up, thumbs_down,
                thumbs_up_given, thumbs_down_given, activity_level, last_active
        FROM user_login
        INNER JOIN user_profile ON user_login.user_id = user_profile.user_id
        INNER JOIN user_stats ON user_login.user_id = user_stats.user_id
        WHERE user_login.user_id = $1`,
        [userId]);
    if (res.rowCount == 0) {
        client.end();
        throw {
            'statusCode': 400,
            'error': "No user found"
        }
    }
    if (res.rowCount >= 2) {
        client.end();
        throw {
            'statusCode': 500,
            'error': "Something is broken, returning 2 or more users"
        }
    }
    var jsonObj = JSON.parse(JSON.stringify(res.rows[0]));
    return jsonObj;
}

async function fetchUser(client, userId, ownUserId, languageId) {
    if (!Number.isInteger(userId)) {
        throw {
            'statusCode': 400,
            'error': "Invalid user id"
        }
    }

    var jsonObj = {};

    const alternativeLanguageId = await getLanguage(client, 'EN');

    jsonObj = await getUserdata(client, userId);
    
    jsonObj['own_profile'] = false;
    if (ownUserId !== null) {
        if (Number.isInteger(ownUserId)) {
            jsonObj['own_profile'] = (ownUserId === userId);
        }
        else {
            throw {
                'statusCode': 400,
                'error': "own user id invalid"
            }
        }
    }

    if (!jsonObj['own_profile']) {
        jsonObj['username'] = null;
        jsonObj['email'] = null;
    }

    jsonObj['country_name'] = await getCountryName(client, jsonObj['country_id'], languageId, alternativeLanguageId);

    jsonObj['city_name'] = await getCityName(client, jsonObj['city_id'], languageId, alternativeLanguageId);
    
    return jsonObj;
}

exports.profileLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();
        try {
            var tempId = parseIntParam("user_id", event);

            //TODO: get own user id using cognito
            const ownUserId = await getOwnUserId(client, event);
            const userId = tempId === null ? ownUserId : tempId

            var temp = parseParam("language", event);
            const languageId = temp === null ? await getLanguage(client, 'FI') :
                await getLanguage(client, temp.toUpperCase());

            if (languageId === null || !Number.isInteger(languageId)) {
                throw {
                    'statusCode': 400,
                    'error': "Invalid language id"
                }
            }

            const jsonObj = await fetchUser(client, userId, ownUserId, languageId);
        
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


async function doCognitoChanges(changes) {
    //TODO: change cognito credentials
    throw {
        'statusCode': 501,
        'error': "Cognito related stuff not implemented"
    }
    return
}

async function doLoginChanges(client, ownUserId, changes) {
    await doCognitoChanges(changes);
    try {
        var values = [ownUserId];
        var columns = '';
        var arrayIndex = 2;
        for (var key in changes) {
            // check if the property/key is defined in the object itself, not in parent
            if (changes.hasOwnProperty(key)) {
                if (arrayIndex > 2) {
                    columns += ', ';
                }
                columns += key + ' = $' + arrayIndex.toString();
                values.push(changes[key]);
                arrayIndex++;
            }
        }
        await client.query('UPDATE user_login SET ' + columns + ' WHERE user_id = $1', values);
    }
    catch (err) {
        //TODO: revert changes to cognito
        throw err;
    }
    return
}

async function doUserChanges(client, ownUserId, userChanges) {
    var values = [ownUserId];
    var columns = '';
    var arrayIndex = 2;
    for (var key in userChanges) {
        // check if the property/key is defined in the object itself, not in parent
        if (userChanges.hasOwnProperty(key)) {
            if (arrayIndex > 2) {
                columns += ', ';
            }
            columns += key + ' = $' + arrayIndex.toString();
            values.push(userChanges[key]);
            arrayIndex++;
        }
    }
    await client.query('UPDATE user_profile SET ' + columns + ' WHERE user_id = $1', values);
    return
}

exports.editProfileLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();
        try {
            //TODO: get own user id using cognito
            const ownUserId = await getOwnUserId(client, event);
            if (ownUserId === null) {
                throw {
                    'statusCode': 401,
                    'error': "Not logged in"
                }
            }

            var cognitoChanges = {};
            var userChanges = {};
            var fieldValue;

            if (hasParam('username', event)) {
                fieldValue = parseParam('username', event);
                if (fieldValue !== null && fieldValue.length > 3 && /^[0-9A-Za-z-_]+$/.test(fieldValue)) {
                    cognitoChanges['username'] = fieldValue;
                }
                else {
                    throw {
                        'statusCode': 400,
                        'error': "invalid username"
                    }
                }
            }
            if (hasParam('password', event)) {
                fieldValue = parseParam('password', event);
                if (fieldValue !== null && fieldValue !== '') {
                    cognitoChanges['password'] = fieldValue;
                }
                else {
                    throw {
                        'statusCode': 400,
                        'error': "password can't be empty"
                    }
                }
            }
            if (hasParam('email', event)) {
                fieldValue = parseParam('email', event);
                if (fieldValue !== null && fieldValue !== '') {
                    cognitoChanges['email'] = fieldValue;
                }
                else {
                    throw {
                        'statusCode': 400,
                        'error': "email can't be empty"
                    }
                }
            }
            if (hasParam('display_name', event)) {
                fieldValue = parseParam('display_name', event);
                if (fieldValue !== null && fieldValue.length > 3 && /^[0-9A-Za-z-_\d\s]+$/.test(fieldValue)) {
                    userChanges['display_name'] = fieldValue;
                }
                else {
                    throw {
                        'statusCode': 400,
                        'error': "invalid display name"
                    }
                }
            }
            if (hasParam('gender', event)) {
                fieldValue = parseParam('gender', event);
                userChanges['gender'] = fieldValue;
            }
            if (hasParam('image', event)) {
                // TODO: image adding
                throw {
                    'statusCode': 501,
                    'error': "Adding image not implemented"
                }
            }
            if (hasParam('birth_year', event)) {
                if (parseParam('birth_year', event) === null) {
                    userChanges['birth_year'] = null;
                }
                else {
                    fieldValue = parseIntParam('birth_year', event);
                    if (fieldValue !== null) {
                        userChanges['birth_year'] = fieldValue;
                    }
                    else {
                        throw {
                            'statusCode': 400,
                            'error': "Invalid year"
                        }
                    }
                }
            }
            if (hasParam('birth_month', event)) {
                fieldValue = parseParam('birth_month', event)
                if (fieldValue === null || fieldValue === '0') {
                    userChanges['birth_month'] = null;
                }
                else {
                    fieldValue = parseIntParam('birth_month', event);
                    if (fieldValue !== null && fieldValue >= 1 && fieldValue <= 12) {
                        userChanges['birth_month'] = fieldValue;
                    }
                    else {
                        throw {
                            'statusCode': 400,
                            'error': "Invalid month"
                        }
                    }
                }
            }
            if (hasParam('description', event)) {
                fieldValue = parseParam('description', event)
                userChanges['description'] = fieldValue;
            }
            if (hasParam('country_id', event)) {
                fieldValue = parseIntParam('country_id', event)
                userChanges['country_id'] = fieldValue;
                userChanges['city_id'] = null;
            }
            if (hasParam('city_id', event)) {
                fieldValue = parseIntParam('city_id', event)
                userChanges['city_id'] = fieldValue;
            }
            if (hasParam('diet_id', event)) {
                fieldValue = parseIntParam('diet_id', event)
                userChanges['diet_id'] = fieldValue;
                throw {
                    'statusCode': 501,
                    'error': "Changing diet should be possible elsewhere too"
                }
            }
            if (hasParam('new_diet', event)) {
                fieldValue = parseParam('new_diet', event)
                throw {
                    'statusCode': 501,
                    'error': "Adding own diet should be possible elsewhere too"
                }
            }
            if (!cognitoChanges.isEmpty()) {
                await doLoginChanges(client, ownUserId, cognitoChanges);
            }
            if (!userChanges.isEmpty()) {
                await doUserChanges(client, ownUserId, userChanges);
            }
        } finally {
            await client.end();
        }
        

        response = packResponse({ 'message': "Operation completed successfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

