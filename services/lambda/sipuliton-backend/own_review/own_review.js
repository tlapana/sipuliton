let response;

const pg = require('pg');
const AWS = require('aws-sdk');
var fetch = require('node-fetch');
var jose = require('node-jose');

// Database credentials
const region = 'eu-central-1';
const dbPort = 5432;
const dbUsername = 'lambda_user'; 
const dbName = 'sipuliton'; 
const dbEndpoint = 'sipulitondb.c15ehja7hync.eu-central-1.rds.amazonaws.com';

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

function parseFloatParam(varStr, event) {
    var val = parseParam(varStr, event);
    var parsed = parseFloat(val);
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

async function getOwnReviews(client, ownUserId, status, offset, limit) {
    var jsonObj = {};
    jsonObj['review_count'] = 0;
    if (status === null) {
        const res = await client.query(
            `SELECT review.review_id, status, posted, title, review.restaurant_id, restaurant.name,
                review.image_url, free_text, rating_overall, rating_reliability, rating_variety,
                rating_service_and_quality, pricing, thumbs_up, thumbs_down, array_agg(global_diet_id) AS diets,
                accepted, rejected, reason
            FROM review_diet, restaurant, review
                LEFT JOIN review_accept_log ON review.review_id = review_accept_log.review_id
                LEFT JOIN review_reject_log ON review.review_id = review_reject_log.review_id
            WHERE review.user_id = $1 AND review_diet.review_id = review.review_id
                AND restaurant.restaurant_id = review.restaurant_id
            GROUP BY review.review_id, status, posted, title, review.restaurant_id, restaurant.name,
                review.image_url, free_text, rating_overall, rating_reliability, rating_variety,
                rating_service_and_quality, pricing, thumbs_up, thumbs_down, accepted, rejected, reason
            LIMIT $3
            OFFSET $2`,
            [ownUserId, offset, limit]);
        if (res.rowCount > 0) {
            jsonObj['reviews'] = JSON.parse(JSON.stringify(res.rows)); 
        }
        const res2 = await client.query(
            `SELECT COUNT(*) AS review_count FROM review WHERE user_id = $1`,
            [ownUserId]);
        if (res2.rowCount > 0) {
            jsonObj['review_count'] = res2.rows[0]['review_count'];
        }
    }
    else {
        if (status == 0) {
            const res = await client.query(
                `SELECT review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down, array_agg(global_diet_id) AS diets
                FROM review, review_diet, restaurant
                WHERE status = $2 AND review.user_id = $1 AND review_diet.review_id = review.review_id
                    AND restaurant.restaurant_id = review.restaurant_id
                GROUP BY review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down
                LIMIT $4
                OFFSET $3`,
                [ownUserId, status, offset, limit]);
            if (res.rowCount > 0) {
                jsonObj['reviews'] = JSON.parse(JSON.stringify(res.rows)); 
            }
        }
        if (status == 1) {
            const res = await client.query(
                `SELECT review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down, array_agg(global_diet_id) AS diets, accepted
                FROM review, review_diet, restaurant, review_accept_log
                WHERE status = $2 AND review.user_id = $1 AND review_diet.review_id = review.review_id
                    AND restaurant.restaurant_id = review.restaurant_id AND review.review_id = review_accept_log.review_id
                GROUP BY review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down, accepted
                LIMIT $4
                OFFSET $3`,
                [ownUserId, status, offset, limit]);
            if (res.rowCount > 0) {
                jsonObj['reviews'] = JSON.parse(JSON.stringify(res.rows));
            }
        }
        if (status == 2) {
            const res = await client.query(
                `SELECT review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down, array_agg(global_diet_id) AS diets, rejected, reason
                FROM review, review_diet, restaurant, review_reject_log
                WHERE status = $2 AND review.user_id = $1 AND review_diet.review_id = review.review_id
                    AND restaurant.restaurant_id = review.restaurant_id AND review_reject_log.review_id = review.review_id
                GROUP BY review.review_id, status, posted, title, review.restaurant_id, restaurant.name, review.image_url, free_text,
                    rating_overall, rating_reliability, rating_variety, rating_service_and_quality,
                    pricing, thumbs_up, thumbs_down, rejected, reason
                LIMIT $4
                OFFSET $3`,
                [ownUserId, status, offset, limit]);
            if (res.rowCount > 0) {
                jsonObj['reviews'] = JSON.parse(JSON.stringify(res.rows));
            }
        }
        const res2 = await client.query(
            `SELECT COUNT(*) AS review_count FROM review WHERE user_id = $1 AND status = $2`,
            [ownUserId, status]);
        if (res2.rowCount > 0) {
            jsonObj['review_count'] = res2.rows[0]['review_count'];
        }
    }
    //TODO: get images from url
    return jsonObj;
}


exports.getOwnReviewsLambda = async (event, context) => {
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

            const status = parseIntParam('status', event);
            if (hasParam('status', event) && (status === null || status < 0 | status > 2)) {
                throw {
                    'statusCode': 400,
                    'error': "invalid status code"
                }
            }
            var temp = parseIntParam('limit', event);
            const limit = temp === null ? 10 : temp;
            var temp = parseIntParam('offset', event);
            const offset = temp === null ? 0 : temp;

            var jsonObj = await getOwnReviews(client, ownUserId, status, offset, limit);

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


async function isOwnReview(client, userId, reviewId) {
    const res = await client.query(
            `SELECT review_id
            FROM review
            WHERE review.user_id = $1 AND review_id = $2`,
            [userId, reviewId]);
    if (res.rowCount > 0) {
        return true;
    }
    return false;
}

async function editReview(client, reviewId, changes, images, diets) {
    if (diets !== null) {
        await client.query(`DELETE FROM review_diet
            WHERE review_id = $1`,
            [reviewId]);
        var len = diets.length;
        for (var i = 0; i < len; i++) {
            await client.query(`INSERT INTO review_diet (review_id, global_diet_id)
                VALUES ($1, $2)`,
                [reviewId, diets[i]]);
        }
    }
    if (images !== null) {
        //TODO: remove images from s3 and add new 
        throw {
            'statusCode': 501,
            'error': "Not implemented"
        }
    }
    var values = [reviewId];
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
    if (columns === '') {
        throw {
            'statusCode': 400,
            'error': "No changes given"
        }
    }
    await client.query('UPDATE review SET ' + columns + ' WHERE status = 0 AND review_id = $1', values);
    return
}

async function deleteReview(client, reviewId) {
    await client.query(`DELETE FROM review_from WHERE review_id = $1`,
        [reviewId]);
    await client.query(`DELETE FROM review_reject_log WHERE review_id = $1`,
        [reviewId]);
    await client.query(`DELETE FROM review_accept_log WHERE review_id = $1`,
        [reviewId]);
    await client.query(`DELETE FROM thumbs WHERE review_id = $1`,
        [reviewId]);
    await client.query(`DELETE FROM review_diet WHERE review_id = $1`,
        [reviewId]);
    await client.query(`DELETE FROM review WHERE review_id = $1`,
        [reviewId]);
    return
}


exports.editReviewLambda = async (event, context) => {
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

            const reviewId = parseIntParam('review_id', event);
            if (!(await isOwnReview(client, ownUserId, reviewId))) {
                throw {
                    'statusCode': 403,
                    'error': "Not own review"
                }
            }
            var changes = {};
            var diets = null;
            var images = null;

            var temp = parseParam("title", event);
            if (temp !== null) {
                changes['title'] = temp;
            }
            temp = JSON.parse(parseParam("images", event));
            if (temp !== null) {
                images = temp;
            }
            temp = parseParam("text", event);
            if (temp !== null) {
                changes['free_text'] = temp;
            }
            temp = parseFloatParam("rating_overall", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating overall"
                    }
                }
                changes['rating_overall'] = temp;
            }
            temp = parseFloatParam("rating_variety", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating variety"
                    }
                }
                changes['rating_variety'] = temp;
            }
            temp = parseFloatParam("rating_service_and_quality", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating service and quality"
                    }
                }
                changes['rating_service_and_quality'] = temp;
            }
            temp = parseFloatParam("pricing", event);
            if (temp !== null) {
                if (temp < 0 | temp > 3) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid pricing"
                    }
                }
                changes['pricing'] = temp;
            }
            temp = JSON.parse(parseParam("diets", event));
            if (temp !== null) {
                diets = temp;
            }

            await editReview(client, reviewId, changes, images, diets);

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


exports.deleteReviewLambda = async (event, context) => {
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

            const reviewId = parseIntParam('review_id', event);
            if (!(await isOwnReview(client, ownUserId, reviewId))) {
                throw {
                    'statusCode': 403,
                    'error': "Not own review"
                }
            }

            await deleteReview(client, reviewId);

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

