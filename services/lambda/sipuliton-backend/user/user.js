
let response;
var fetch = require('node-fetch');
var jose = require('node-jose');

var region = 'eu-central-1';
var userpool_id = 'eu-central-1_RcdrXwM4n';
var app_client_id = '6shik8f5c8k0dc7oje4qumn6fd';
var keys_url = 'https://cognito-idp.' + region + '.amazonaws.com/' + userpool_id + '/.well-known/jwks.json';

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

// getCognitoUserInfo taken from here and modified:
// https://github.com/awslabs/aws-support-tools/tree/master/Cognito/decode-verify-jwt
async function getCognitoUserInfo(token) {
    var sections = token.split('.');
    // get the kid from the headers prior to verification
    var header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    var kid = header.kid;
    // download the public keys
    var response = await fetch(keys_url);
    if (response && response.status == 200) {
        var body = await response.json();
        var keys = body['keys'];
        
        // search for the kid in the downloaded public keys
        var key_index = -1;
        for (var i=0; i < keys.length; i++) {
            if (kid == keys[i].kid) {
                key_index = i;
                break;
            }
        }
        if (key_index == -1) {
            return 'Public key not found in jwks.json';
        }
        // construct the public key
        try {
            var result = await jose.JWK.asKey(keys[key_index]);
            // verify the signature
            result = await jose.JWS.createVerify(result).verify(token);
            // now we can use the claims
            var claims = JSON.parse(result.payload);
            // additionally we can verify the token expiration
            var current_ts = Math.floor(new Date() / 1000);
            if (current_ts > claims.exp) {
                return 'Token is expired';
            }
            // and the Audience (use claims.client_id if verifying an access token)
            if (claims.aud != app_client_id) {
                return 'Token was not issued for this audience';
            }
            return claims;
        }
        catch (err) {
            return 'Signature verification failed';
        }
    }
}


async function getOwnUserId(client, event) {
    var token = null;
    var userSub = null;
    
    if (event && event.headers) {
        token = event.headers['Authorization'];
    }
    try {
        var cognitoUser = await getCognitoUserInfo(token);
        userSub = cognitoUser['sub'];
    }
    catch (err) {
        console.log(err);
    }
    if (!userSub) {
        throw {
            'statusCode': 400,
            'error': "Cognito user not found or authentication failed",
        }
    }
    
    const res = await client.query('SELECT user_id FROM user_login WHERE cognito_sub = $1', [userSub]);
    if (res.rowCount == 0) {
        throw {
            'statusCode': 400,
            'error': "No user found"
        }
    }
    if (res.rowCount >= 2) {
        throw {
            'statusCode': 500,
            'error': "Something is broken, returning 2 or more users"
        }
    }
    return parseInt(res.rows[0]['user_id']);
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

async function createUser(client, cognitoSub, username, email, languageId) {
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
    return
}

exports.createUserLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();
        try {
            //TODO: check that user exists in cognito
            var cognitoSub = null;
            var username = null;
            var email = null;
            var fieldValue;
            
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

            var temp = parseParam("language", event);
            const languageId = temp === null ? await getLanguage(client, 'FI') :
                await getLanguage(client, temp.toUpperCase());

            if (languageId === null || !Number.isInteger(languageId)) {
                throw {
                    'statusCode': 400,
                    'error': "Invalid language id"
                }
            }

            await createUser(client, cognitoSub, username, email, languageId);

            response = packResponse({ 'message': "Operation completed successfully" });

        } finally {
            await client.end();
        }
    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};


async function getCognitoUser(client, cognitoSub) {
	try {
		const res = await client.query(
			`SELECT user_id FROM user_login
			WHERE cognito_sub = $1`,
			[cognitoSub]);
		if (res.rowCount == 0) {
			throw {
				'statusCode': 400,
				'error': "No user found"
			}
		}
		if (res.rowCount >= 2) {
			throw {
				'statusCode': 500,
				'error': "Something is broken, returning 2 or more users"
			}
		}
		var jsonObj = JSON.parse(JSON.stringify(res.rows[0]));
		return jsonObj;
	} catch (err) {
		throw err;
	}
}

exports.getUserByCognitoLambda = async (event, context) => {
    try {
        const client = await getPsqlClient();
        try {
			var userId = await getOwnUserId(client, event);
            var jsonObj = {user_id: userId};
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







async function deleteUser(client, userId, keepReviews, permanent) {
    await client.query('BEGIN');
    try {
        await client.query(
            `UPDATE user_profile
            SET display_name = '', image_url = NULL, birth_year = NULL, birth_month = NULL,
            gender = NULL, description = NULL, country_id = NULL, city_id = NULL, diet_id = NULL
            WHERE user_id = $1`,
            [userId]);
        if (!keepReviews) {
            await client.query(`DELETE FROM diet_name WHERE user_id = $1`, [userId]);
            await client.query(`DELETE FROM suspicious_review WHERE user_id = $1`, [userId]);
            await client.query(`DELETE FROM review_from WHERE user_id = $1`, [userId]);
            await client.query(`DELETE FROM review_reject_log WHERE poster_id = $1`, [userId]);
            await client.query(`DELETE FROM review_accept_log WHERE poster_id = $1`, [userId]);
            await client.query(`DELETE FROM thumbs WHERE poster_id = $1 OR thumber_id = $1`, [userId]);
            await client.query(`DELETE FROM review_diet WHERE user_id = $1`, [userId]);
            await client.query(`DELETE FROM review WHERE user_id = $1`, [userId]);
            await client.query(`DELETE FROM restaurant_ownership_request WHERE owner_id = $1`, [userId]);
            await client.query(`DELETE FROM restaurant_owners WHERE owner_id = $1`, [userId]);
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
    return;
}


exports.deleteUserLambda = async (event, context) => {
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

            const keepReviews = JSON.parse(parseParam("reviews", event)) !== true;
            const permanent = JSON.parse(parseParam("permanent", event)) === true;

            await deleteUser(client, ownUserId, keepReviews, permanent);

            response = packResponse({ 'message': "User removed successfully" });
        }
        finally {
            client.end();
        }

    } catch (err) {
        response = errorHandler(err);
    }

    console.log(response);
    return response;
};

