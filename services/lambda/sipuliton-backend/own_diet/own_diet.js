
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
    return 1;
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

async function deleteDiet(client, userId, dietId) {
    await client.query(
        `DELETE FROM diet_name
        WHERE user_id = $1 AND diet_id = $2`,
        [userId, dietId]);
    return;
}

exports.deleteDietLambda = async (event, context) => {
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

            const dietId = parseIntParam("diet_id", event);

            if (dietId === null) {
                throw {
                    'statusCode': 400,
                    'error': "Invalid diet id"
                }
            }

            await deleteDiet(client, ownUserId, dietId);

            response = packResponse({ 'message': "Diet removed succesfully" });
        } finally {
            await client.end();
        }
    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


async function getOwnDiets(client, userId) {
    const res = await client.query(
        `SELECT diet_id, diet_name.global_diet_id, name, array_agg(food_group_id) as groups
        FROM diet_name LEFT JOIN diet_groups ON diet_name.global_diet_id = diet_groups.global_diet_id
        WHERE user_id = $1
        GROUP BY diet_id, diet_name.global_diet_id, name
        ORDER BY name`,
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
            'error': "No user diet found"
        }
    }
    var dietId = res.rows[0]['diet_id'];
    return dietId;
}


exports.getOwnDietsLambda = async (event, context) => {
    try {
        var jsonObj = {};
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


async function saveDiet(client, groups) {
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
                `INSERT INTO global_diet (preset)
                VALUES (FALSE)
                RETURNING global_diet_id`);
            jsonObj = JSON.parse(JSON.stringify(res2.rows[0]));
            var len = groups.length;
            for (var i = 0; i < len; i++) {
                await client.query(
                    `INSERT INTO diet_groups
                    VALUES ($1, $2)`,
                    [jsonObj['global_diet_id'], groups[i]]);
            }
        }
        else if (res.rowCount == 1) {
            jsonObj = JSON.parse(JSON.stringify(res.rows[0]));
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

async function saveOwnDiet(client, userId, dietId, name) {
    await client.query(
        `INSERT INTO diet_name
            VALUES ($1, (SELECT coalesce(max(diet_id),0)+1 FROM diet_name WHERE user_id = $1),
                $2, $3)`,
        [userId, dietId, name]);
}

async function editOwnDiet(client, userId, ownDietId, dietId, name) {
    await client.query(
        `UPDATE diet_name
            SET global_diet_id = $3, name = $4
            WHERE user_id = $1 AND diet_id = $2`,
        [userId, ownDietId, dietId, name]);
}


exports.editOwnDietLambda = async (event, context) => {
    try {
        var jsonObj = {};
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

            var temp = parseIntParam("diet_id", event);
            if (temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "user diet id not set"
                }
            }
            const userDietId = temp;

            temp = JSON.parse(parseParam("groups", event));
            if (temp !== null && temp.length < 1) {
                throw {
                    'statusCode': 400,
                    'error': "cannot create empty diet"
                }
            }
            const groups = temp;

            temp = parseParam("name", event);
            if (temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "must have name"
                }
            }
            const name = temp;
            
            temp = parseIntParam("global_diet_id", event);
            var dietId = temp;
            if (groups !== null) {
                jsonObj = await saveDiet(client, groups);
                dietId = jsonObj['global_diet_id'];
            }
            if (dietId === null) {
                throw {
                    'statusCode': 400,
                    'error': "global diet id not set"
                }
            }
            await editOwnDiet(client, ownUserId, userDietId, dietId, name);

        } finally {
            await client.end();
        }

        response = packResponse({ 'message': "Operation completed succesfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

exports.createOwnDietLambda = async (event, context) => {
    try {
        var jsonObj = {};
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

            temp = JSON.parse(parseParam("groups", event));
            if (temp !== null && temp.length < 1) {
                throw {
                    'statusCode': 400,
                    'error': "cannot create empty diet"
                }
            }
            const groups = temp;

            temp = parseParam("name", event);
            if (temp === null) {
                throw {
                    'statusCode': 400,
                    'error': "must have name"
                }
            }
            const name = temp;

            temp = parseIntParam("global_diet_id", event);
            var dietId = temp;
            if (groups !== null) {
                jsonObj = await saveDiet(client, groups);
                dietId = jsonObj['global_diet_id'];
            }
            if (dietId === null) {
                throw {
                    'statusCode': 400,
                    'error': "global diet id not set"
                }
            }
            await saveOwnDiet(client, ownUserId, dietId, name);

        } finally {
            await client.end();
        }

        response = packResponse({ 'message': "Operation completed succesfully" });

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
}

