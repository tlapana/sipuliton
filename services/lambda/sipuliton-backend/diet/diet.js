
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

async function voteDiet(client, userId, restaurantId, dietId, up) {
    if (up === -1) {
        await client.query(`DELETE FROM diet_vote WHERE user_id = $1 AND global_diet_id = $2 AND restaurant_id = $3 `,
            [userId, dietId, restaurantId]);
        return;
    }
    if (up === null) {
        //swap between vote up/down
        await client.query(`INSERT INTO diet_vote(restaurant_id, global_diet_id, user_id, up)
                            VALUES ($3, $2, $1, TRUE)
                            ON CONFLICT (restaurant_id, global_diet_id, user_id) DO UPDATE
                                SET up = NOT diet_vote.up`,
            [userId, dietId, restaurantId]);
    }
    else {
        await client.query(`INSERT INTO diet_vote(restaurant_id, global_diet_id, user_id, up)
                            VALUES ($3, $2, $1, $4)
                            ON CONFLICT (restaurant_id, global_diet_id, user_id) DO UPDATE
                                SET up = $4`,
            [userId, dietId, restaurantId, up]);
    }
    return;
}

exports.voteDietLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            const ownUserId = await getOwnUserId(client, event);
            if (ownUserId === null) {
                throw {
                    'statusCode': 401,
                    'error': "Not logged in"
                }
            }
            var restaurantId = parseIntParam("restaurant_id", event);
            if (restaurantId === null) {
                throw {
                    'statusCode': 400,
                    'error': "restaurant_id not set"
                }
            }
            var dietId = parseIntParam("diet_id", event);
            if (dietId === null) {
                throw {
                    'statusCode': 400,
                    'error': "diet_id not set"
                }
            }

            var up = parseParam("up", event);
            var down = parseParam("down", event);
            if (up !== null & down !== null) {
                up = null;
            }
            else if (up === null & down === null) {
                up = -1;
            }
            else if (up !== null) {
                up = true;
            }
            else {
                up = false;
            }
            await voteDiet(client, ownUserId, restaurantId, dietId, up);

            response = packResponse({ 'message' : 'Operation completed successfully'});
        } finally {
            await client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

async function saveDiet(client, languageId, name, preset, groups) {
    var jsonObj = {};
    await client.query('BEGIN');
    try {
        const res = await client.query(
            `SELECT global_diet_id
            FROM (SELECT global_diet_id, array_agg(food_group_id) as groups
                FROM diet_groups
                GROUP BY global_diet_id) AS groups_agg
            WHERE groups = $1`,
            [groups]);
        if (res.rowCount == 0) {
            const res2 = await client.query(
                `INSERT INTO global_diet
                VALUES ((SELECT coalesce(max(global_diet_id),0)+1 FROM global_diet), $1)
                RETURNING global_diet_id`,
                [preset]);
            jsonObj = JSON.parse(JSON.stringify(res2.rows[0]));
            if (name !== null) {
                await client.query(
                    `INSERT INTO global_diet_name
                    VALUES ($2, $3, $1)`,
                    [name, jsonObj['global_diet_id'], languageId]);
            }
            var len = groups.length;
            for (var i = 0; i < len; i++) {
                await client.query(
                    `INSERT INTO diet_groups
                    VALUES ($1, $2)`,
                    [jsonObj['global_diet_id'], groups[i]]);
            }
        }
        else if (res.rowCount == 1) {
            throw {
                'statusCode': 400,
                'error': "diet exists"
            }
        }
        else {
            throw {
                'statusCode': 500,
                'error': "DB is broken"
            }
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    return jsonObj;
}

async function updateDiet(client, languageId, name, preset, dietId, groups) {
    var jsonObj = {};
    await client.query('BEGIN');
    try {
        if (preset !== null) {
            await client.query(
                `UPDATE global_diet
                SET preset = $1
                WHERE global_diet_id = $2`,
                [preset, dietId]);
        }
        if (name !== null) {
            await client.query(
                `INSERT INTO global_diet_name
                VALUES ($2, $3, $1)
                ON CONFLICT (id) DO UPDATE global_diet_name
                SET name = $1
                WHERE global_diet_id = $2 AND language_id = $3`,
                [name, dietId, languageId]);
        }
        if (groups !== null) {
            await client.query(
                `DELETE FROM diet_groups
                WHERE global_diet_id = $1`,
                [dietId])
            var len = groups.length;
            for (var i = 0; i < len; i++) {
                await client.query(
                    `INSERT INTO diet_groups
                    VALUES ($1, $2)`,
                    [dietId, groups[i]]);
            }
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    return jsonObj;
}


exports.createDietAdminLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
            await getLanguage(client, temp.toUpperCase());

            temp = JSON.parse(parseParam("preset", event));
            const preset = temp === true ? true : temp === false ? false : null;
            if (preset === null) {
                throw {
                    'statusCode': 400,
                    'error': "Invalid value for preset"
                }
            }

            temp = JSON.parse(parseParam("groups", event));
            if (temp !== null && temp.length < 1 || temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "cannot create empty diet"
                }
            }
            const groups = temp;

            temp = parseParam("name", event);
            const name = temp === null ? null : temp;
            
            const jsonObj = await saveDiet(client, languageId, name, preset, groups);

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


exports.createDietLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
            await getLanguage(client, temp.toUpperCase());
            
            const preset = false;

            temp = JSON.parse(parseParam("groups", event));
            if (temp !== null && temp.length < 1 || temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "cannot create empty diet"
                }
            }
            const groups = temp;

            temp = parseParam("name", event);
            const name = temp === null ? null : temp;

            const jsonObj = await saveDiet(client, languageId, name, preset, groups);

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


exports.updateDietLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();

        try {
            var temp = parseParam("language", event);

            const languageId = temp === null ? await getLanguage(client, 'FI') :
            await getLanguage(client, temp.toUpperCase());

            temp = JSON.parse(parseParam("preset", event));
            const preset = temp === true ? true : temp === false ? false : null;

            temp = parseIntParam("global_diet_id", event);
            if (temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "diet id not set"
                }
            }
            dietId = temp;

            temp = JSON.parse(parseParam("groups", event));
            if (temp !== null && temp.length < 1) {
                throw {
                    'statusCode': 400,
                    'error': "cannot create empty diet"
                }
            }
            const groups = temp;

            temp = parseParam("name", event);
            const name = temp === null ? null : temp;

            const jsonObj = await updateDiet(client, languageId, name, preset, dietId, groups);

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

