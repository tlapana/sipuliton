
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

async function getOwnUserId(event) {
    const AWS = require('aws-sdk');
    const cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: 'eu-central-1' });
    //const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1]
    //console.log("user sub:" + userSub);
    return 0;
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


async function getCountryName(client, countryId, languageId, defaultLanguageId) {
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
                [countryId, defaultLanguageId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
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

async function getCityName(client, cityId, languageId, defaultLanguageId) {
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
                [cityId, defaultLanguageId]);
            if (res.rowCount == 0) {
                //TODO: maybe should differentiate between name not found and id being null?
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

async function fetchUser(userId, ownUserId, languageId) {
    if (!Number.isInteger(userId)) {
        throw {
            'statusCode': 400,
            'error': "Invalid user id"
        }
    }
    if (languageId === null || !Number.isInteger(languageId)) {
        throw {
            'statusCode': 400,
            'error': "Invalid language id"
        }
    }

    var jsonObj = {};

    const client = await getPsqlClient();

    try {
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
            delete jsonObj['username'];
            delete jsonObj['email'];
        }

        const defaultLanguageId = await getLanguage(client, 'EN');

        jsonObj['country_name'] = await getCountryName(client, jsonObj['country_id'], languageId, defaultLanguageId);

        jsonObj['city_name'] = await getCityName(client, jsonObj['city_id'], languageId, defaultLanguageId);

    } finally {
        await client.end();
    }

    return jsonObj;
}

async function doCognitoChanges(changes) {
    throw {
        'statusCode': 400,
        'error': "Cognito related stuff not implemented"
    }
    return
}

async function createUser(cognitoSub, username, email, languageId) {
    const client = await getPsqlClient();

    try {
        await client.query('BEGIN');
        try {
            const res = await client.query(
                `INSERT INTO user_login (user_id, cognito_sub, username, email)
                VALUES ((SELECT coalesce(max(user_id),0)+1 FROM user_login), $1, $2, $3)
                RETURNING user_id`,
                [cognitoSub, username, email]);

            const userId = res.rows[0]['user_id'];
            await client.query(
                `INSERT INTO user_profile (user_id, role, display_name, image_url, language_id,
                    birth_year, birth_month, gender, description,
                    country_id, city_id, diet_id)
                VALUES ($1, 0, $2, NULL, $3,
                    NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL)`,
                [userId, username, languageId]);

            await client.query(
                `INSERT INTO user_stats (user_id, countries, cities, reviews,
                    thumbs_up, thumbs_down, thumbs_up_given, thumbs_down_given,
                    activity_level, last_active)
                VALUES ($1, 0, 0, 0,
                    0, 0, 0, 0,
                    0, timezone('utc', now()))`,
                [userId]);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
    } finally {
        await client.end();
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

async function deleteDiet(userId, dietId) {
    const client = await getPsqlClient();
    try {
        await client.query(
            `DELETE FROM diet_name
        WHERE user_id = $1 AND diet_id = $2`,
            [userId, dietId]);
    } finally {
        await client.end();
    }
    return;
}

async function deleteUser(userId, keepReviews, permanent) {
    const client = await getPsqlClient();
    try {
        await client.query('BEGIN');
        try {
            await client.query(
                `UPDATE user_profile
                SET display_name = '', image_url = NULL, birth_year = NULL, birth_month = NULL,
                gender = NULL, description = NULL, country_id = NULL, city_id = NULL, diet_id = NULL
                WHERE user_id = $1`,
                [userId]);
            if (!keepReviews) {
                await client.query(`DELETE FROM diet_name WHERE user_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM suspicious_review WHERE user_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM review_reject_log WHERE poster_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM review_accept_log WHERE poster_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM thumbs WHERE poster_id = $1 OR thumber_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM review_diet WHERE poster_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM review WHERE poster_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM restaurant_ownership_request WHERE owner_id = $1`, [ownUserId]);
                await client.query(`DELETE FROM restaurant_owners WHERE owner_id = $1`, [ownUserId]);
                await client.query(
                    `UPDATE user_stats
                    SET countries = 0, cities = 0, reviews = 0, thumbs_up = 0, thumbs_down = 0,
                    thumbs_up_given = 0, thumbs_down_given = 0, activity_level = 0, last_active = NULL
                    WHERE user_id = $1`,
                    [userId]);
            }
            if (permanent) {
                await client.query(
                    `UPDATE user_login
                    SET cognito_sub = NULL, username = NULL, email = NULL
                    WHERE user_id = $1`,
                    [userId]);
            }
            else {
                await client.query(
                    `UPDATE user_login
                    SET cognito_sub = NULL
                    WHERE user_id = $1`,
                    [userId]);
            }
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
    }
    finally {
        client.end();
    }
    return;
}

async function getOwnDiets(client, userId) {
    const res = await client.query(
        `SELECT diet_id, diet_name.global_diet_id, name, array_agg(food_group_id) as groups
        FROM diet_name LEFT JOIN diet_groups ON diet_name.global_diet_id = diet_groups.global_diet_id
        WHERE user_id = $1
        GROUP BY diet_id, diet_name.global_diet_id, name`,
        [userId]);
    if (res.rowCount > 0) {
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getSelectedDiet(client, userId) {
    const res = await client.query(
        `SELECT diet_id
        FROM user_profile
        WHERE user_id = $1`,
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
    var dietId = res.rows[0]['diet_id'];
    return dietId;
}

exports.profileLambda = async (event, context) => {
    try {
        var tempId = parseIntParam("userId", event);
        //TODO: get user id from cognito if not requesting specified user
        const userId = !tempId ? 0 : tempId

        //TODO: get own user id using cognito
        const ownUserId = await getOwnUserId(event);

        //TODO: possibly query language id if not saved as id in cookies
        tempId = parseIntParam("language", event);
        const languageId = !tempId ? 0 : tempId

        const jsonObj = await fetchUser(userId, ownUserId, languageId);
        
        response = packResponse(jsonObj);

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

exports.editProfileLambda = async (event, context) => {
    try {
        //TODO: get own user id using cognito
        const ownUserId = await getOwnUserId(event);
        if (ownUserId === null) {
            throw {
                'statusCode': 400,
                'error': "Not logged in"
            }
        }

        var cognitoChanges = {};
        var userChanges = {};
        var fieldValue;

        if (hasParam('username', event)) {
            fieldValue = parseParam('username', event);
            if (fieldValue !== null && fieldValue !== '') {
                cognitoChanges['username'] = fieldValue;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "username can't be empty"
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
            if (fieldValue !== null && fieldValue !== '') {
                userChanges['display_name'] = fieldValue;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Display name can't be empty"
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
                'statusCode': 400,
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
                'statusCode': 500,
                'error': "Changing diet should be possible elsewhere too"
            }
        }
        if (hasParam('new_diet', event)) {
            fieldValue = parseParam('diet', event)
            throw {
                'statusCode': 500,
                'error': "Adding own diet should be possible elsewhere too"
            }
        }

        const client = await getPsqlClient();

        try {
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


exports.createUserLambda = async (event, context) => {
    try {
        //TODO: check that user exists in cognito

        //TODO: possibly query language id if not saved as id in cookies
        tempId = parseIntParam("language", event);
        const languageId = !tempId ? 0 : tempId

        var cognitoSub = null;
        var username = null;
        var email = null;
        var fieldValue;

        if (hasParam('username', event)) {
            fieldValue = parseParam('username', event);
            if (fieldValue !== null && fieldValue !== '') {
                username = fieldValue;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "username can't be empty"
                }
            }
        }
        if (hasParam('cognito_sub', event)) {
            fieldValue = parseParam('cognito_sub', event);
            if (fieldValue !== null && fieldValue !== '') {
                cognitoSub = fieldValue;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "cognito_sub can't be empty"
                }
            }
        }
        if (hasParam('email', event)) {
            fieldValue = parseParam('email', event);
            if (fieldValue !== null && fieldValue !== '') {
                email = fieldValue;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "email can't be empty"
                }
            }
        }
        
        await createUser(cognitoSub, username, email, languageId);

        response = packResponse({ 'message': "Operation completed successfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


exports.deleteDietLambda = async (event, context) => {
    try {
        //TODO: get own user id using cognito
        const ownUserId = await getOwnUserId(event);
        if (ownUserId === null) {
            throw {
                'statusCode': 400,
                'error': "Not logged in"
            }
        }

        const dietId = parseIntParam("diet_id", event);

        if (dietId === null) {
            throw {
                'statusCode': 400,
                'error': "Invalid diet id"
            }
        }

        await deleteDiet(ownUserId, dietId);

        response = packResponse({ 'message': "Diet removed succesfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


exports.deleteUserLambda = async (event, context) => {
    try {
        //TODO: get own user id using cognito
        const ownUserId = await getOwnUserId(event);
        if (ownUserId === null) {
            throw {
                'statusCode': 400,
                'error': "Not logged in"
            }
        }

        const keepReviews = JSON.parse(parseParam("reviews", event)) !== true;
        const permanent = JSON.parse(parseParam("permanent", event)) === true;

        await deleteUser(ownUserId, keepReviews, permanent);

        response = packResponse({ 'message': "User removed succesfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


exports.getOwnDietsLambda = async (event, context) => {
    try {
        //TODO: get own user id using cognito
        const ownUserId = 0;

        const client = await getPsqlClient();

        var jsonObj = {};

        try {
            jsonObj['selected_diet_id'] = await getSelectedDiet(client, ownUserId);
            jsonObj['own_diets'] = await getOwnDiets(client, ownUserId);
        } finally {
            await client.end();
        }
        
        response = packResponse(jsonObj);

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

