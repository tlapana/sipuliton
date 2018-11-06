
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
        console.log('event');
        return event[varStr];
    } else if (event.body && event.body !== "") {
        var body = JSON.parse(event.body);
        if (body[varStr] && body[varStr] !== "") {
            console.log('json');
            return body[varStr];
        }
    } else if (event.queryStringParameters && event.queryStringParameters[varStr] && event.queryStringParameters[varStr] !== "") {
        console.log('stringparams');
        return event.queryStringParameters[varStr];
    } else if (event.multiValueHeaders && event.multiValueHeaders[varStr] && event.multiValueHeaders[varStr] != "") {
        console.log('multiValueHeaders');
        return event.multiValueHeaders[varStr].join(" and ");
    } else if (event.headers && event.headers[varStr] && event.headers[varStr] != "") {
        console.log('headers');
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
        return val;
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

async function getGroups(client, languageId, defaultLanguageId) {
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
        GROUP BY name_join.food_group_id, name`,
        [languageId, defaultLanguageId]);
    if (res.rowCount > 0) {
        console.log(res.rows);
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getPresetDiets(client, languageId, defaultLanguageId) {
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
        GROUP BY name_join.global_diet_id, name`,
        [languageId, defaultLanguageId]);
    if (res.rowCount > 0) {
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getDiets(client, userId) {
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

async function getCities(client, countryId, languageId, defaultLanguageId) {
    if (countryId && countryId !== "") {
        const res = await client.query(
            `SELECT city.city_id, name
            FROM city INNER JOIN city_name ON city.city_id = city_name.city_id
            WHERE (language_id = $1 AND city.country_id = $3) OR ((language_id = $2 AND city.country_id = $3) AND city.city_id NOT IN (
                SELECT city.city_id
                FROM city INNER JOIN city_name ON city.city_id = city_name.city_id
                WHERE language_id = $1 AND name != '' AND city.country_id = $3
                )
            )`,
            [languageId, defaultLanguageId, countryId]);
        if (res.rowCount > 0) {
            var jsonObj = JSON.parse(JSON.stringify(res.rows));
            return jsonObj;
        }
    }
    return null;
}

async function getCountries(client, languageId, defaultLanguageId) {
    const res = await client.query(
        `SELECT country_id, name
        FROM country_name
        WHERE language_id = $1 OR (language_id = $2 AND country_id NOT IN (
                SELECT country_id FROM Country_name
                WHERE language_id = $1 AND name != ''
            )
        )`,
        [languageId, defaultLanguageId]);
    if (res.rowCount > 0) {
        var jsonObj = JSON.parse(JSON.stringify(res.rows));
        return jsonObj;
    }
    return null;
}

async function getUserdata(client, userId) {
    const res = await client.query(
        `SELECT username, email, display_name, gender, image_url, birth_year, birth_month,
                description, country_id, city_id, diet_id, countries AS countries_visited,
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
    jsonObj = JSON.parse(JSON.stringify(res.rows[0]));
    return jsonObj;
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

    const client = await getPsqlClient();

    jsonObj = await getUserdata(client, userId);

    console.log(userId);
    console.log(ownUserId);

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

    if (jsonObj['own_profile']) {
        jsonObj['own_diets'] = await getDiets(client, userId);

        jsonObj['preset_diets'] = await getPresetDiets(client, languageId, defaultLanguageId);

        jsonObj['food_groups'] = await getGroups(client, languageId, defaultLanguageId);

        jsonObj['countries'] = await getCountries(client, languageId, defaultLanguageId);

        jsonObj['cities'] = await getCities(client, jsonObj['country_id'], languageId, defaultLanguageId);
    }

    await client.end();

    return jsonObj;
}

exports.lambdaHandler = async (event, context) => {
    try {
        var tempId = parseIntParam("userId", event);
        //TODO: get user id from cognito if not requesting specified user
        const userId = !tempId ? 0 : tempId

        //TODO: get own user id using cognito
        const ownUserId = userId;

        //TODO: possibly query language id if not saved as id in cookies
        tempId = parseIntParam("language", event);
        const languageId = !tempId ? 0 : tempId

        const jsonObj = await fetchUser(userId, ownUserId, languageId);

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

    } catch (err) {
        console.log(err);
        response = {
            'statusCode': 500,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': JSON.stringify({ 'error': "Something went wrong! " + err})
        };
        if ("statusCode" in err) {
            response['statusCode'] = err['statusCode'];
        }
        if ("error" in err) {
            response['body'] = JSON.stringify({ 'error': err['error'] });
        }
    }

    console.log(response);
    return response;
};

exports.lambdaGetCities = async (event, context) => {
    try {
        const countryId = parseParam('country_id', event);
        //TODO: possibly query language id if not saved as id in cookies
        tempId = parseIntParam("language", event);
        const languageId = !tempId ? 0 : tempId

        const client = await getPsqlClient();

        const defaultLanguageId = await getLanguage(client, 'EN');

        const jsonObj = await getCities(client, countryId, languageId, defaultLanguageId);

        await client.end();

        response = {
            'statusCode': 200,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': JSON.stringify({ jsonObj })
        };
        
    } catch (err) {
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
    }

    console.log(response);
    return response;
}

async function doCognitoChanges(changes) {
    throw {
        'statusCode': 400,
        'error': "Cognito related stuff not implemented"
    }
    return
}

async function doLoginChanges(client, ownUserId, changes) {
    await doCognitoChanges(changes);
    try {
        //TODO: do database changes here
    }
    catch (err) {
        //TODO: revert changes to cognito
    }
    return
}

async function doUserChanges(client, ownUserId, userChanges) {
    var values = [ownUserId];
    var columns = '';
    var arrayIndex = 2;
    console.log(userChanges['display_name'])
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
    console.log('UPDATE user_profile SET ' + columns + ' WHERE user_id = $1');
    console.log(values);
    //await client.query('UPDATE user_profile SET ' + columns + ' WHERE user_id = $1', values);
    return
}

exports.editHandler = async (event, context) => {
    try {
        //TODO: get own user id using cognito
        const ownUserId = 0;
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
        }
        if (hasParam('new_diet', event)) {
            fieldValue = parseParam('diet', event)
            throw {
                'statusCode': 500,
                'error': "Adding a new diet is not done"
            }
        }

        const client = await getPsqlClient();

        if (!cognitoChanges.isEmpty()) {
            await doLoginChanges(client, ownUserId, cognitoChanges);
        }
        if (!userChanges.isEmpty()) {
            await doUserChanges(client, ownUserId, userChanges);
        }

        await client.end();

        throw {
            'statusCode': 500,
            'error': "Work in progress"
        }

    } catch (err) {
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
    }

    console.log(response);
    return response;
};
