
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

exports.lambdaHandler = async (event, context) => {
    try {
        // Result of this query will later go to the returned json
        var pageSize = event.queryStringParameters.pageSize
        const restaurantId = event.queryStringParameters.restaurantId
        var pageNumber = event.queryStringParameters.pageNumber

        const offset = pageNumber * pageSize
        console.log(event)
        var collectReviews = `
        SELECT restaurant_id, user_id, posted, status, title, free_text, rating_overall,
            rating_reliability, rating_variety, rating_service_and_quality,
            pricing, thumbs_up, thumbs_down
        FROM review WHERE restaurant_id = $1
        ORDER BY posted DESC
        LIMIT $2 OFFSET $3
        `
        var pg = require("pg");
       

        //TODO: Before deploying, change to a method for fetching Amazon RDS credentials
        var conn = "postgres://sipuliton:sipuliton@sipuliton_postgres_1/sipuliton";
        const client = new pg.Client(conn);
        await client.connect((err) => {
                console.log("Connecting")
                if (err){
                    console.error("Failed to connect client")
                    console.error(err)
                    throw err
                }
        });
        

        const resReviews = await client.query(collectReviews, [restaurantId, pageSize, offset]);
        var jsonString = JSON.stringify(resReviews.rows);
        var jsonObjReviews = JSON.parse(jsonString);
        await client.end()

        var bodyJSON = {
            'reviews': jsonObjReviews
        }

        response = {
            'statusCode': 200,
            //TODO: Handle CORS in AWS api gateway settings prior to deployment
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': JSON.stringify(bodyJSON)
        };


    } catch (err) {
        console.error(err);
        return err;
    }

    console.log(response)
    return response
};

async function postReview(client, userId, restaurantId, review, images, diets) {
    await client.query(`BEGIN`);
    try {
        // TODO: define where image url is
        if (images !== null) {
            //TODO: add images to s3
            throw {
                'statusCode': 501,
                'error': "Not implemented"
            }
        }
        const res = await client.query(
            `INSERT INTO review (restaurant_id, user_id, posted, status, title, image_url, free_text, rating_overall,
                    rating_reliability, rating_variety, rating_service_and_quality, pricing, thumbs_up, thumbs_down)
                VALUES ($1, $2, timezone('utc', now()), 0, $3, NULL, $4, $5,
                    $6, $7, $8, $9, 0, 0)
                RETURNING review_id`,
            [restaurantId, userId, review['title'], review['free_text'], review['rating_overall'],
            review['rating_reliability'], review['rating_variety'], review['rating_service_and_quality'], review['pricing']]);
        const reviewId = res.rows[0]['review_id'];
        var len = diets.length;
        for (var i = 0; i < len; i++) {
            await client.query(`INSERT INTO review_diet (review_id, global_diet_id)
                VALUES ($1, $2)`,
                [reviewId, diets[i]]);
        }
        await client.query('COMMIT');
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    
    const res2 = await client.query(
        `SELECT review_id FROM review WHERE user_id = $1 AND restaurant_id = $2 AND
            posted >= timezone('utc', now()) - INTERVAL '1 hours'`,
        [userId, restaurantId]);
    if (res2.rowCount > 1) {
        await client.query(
            `INSERT INTO suspicious_review (review_id, reason)
            SELECT review.review_id, 0 FROM review LEFT JOIN suspicious_review ON review.review_id = suspicious_review.review_id
            WHERE user_id = $1 AND restaurant_id = $2 AND posted >= timezone('utc', now()) - INTERVAL '1 hours'
                AND reason IS NULL`,
            [userId, restaurantId]);
    }
    return
}

exports.postReviewLambda = async (event, context) => {
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

            var review = {};
            var diets = null;
            var images = null;
            var restaurantId = null;

            var temp = parseIntParam("restaurant_id", event);
            if (temp !== null) {
                restaurantId = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Invalid restaurant id"
                }
            }
            var temp = parseParam("title", event);
            if (temp !== null) {
                review['title'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Title not set"
                }
            }
            temp = JSON.parse(parseParam("images", event));
            if (temp !== null) {
                images = temp;
            }
            temp = parseParam("text", event);
            if (temp !== null) {
                review['free_text'] = temp;
            }
            else {
                review['free_text'] = '';
            }
            temp = parseFloatParam("rating_overall", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating overall"
                    }
                }
                review['rating_overall'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Overall rating not set"
                }
            }
            temp = parseFloatParam("rating_variety", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating variety"
                    }
                }
                review['rating_variety'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Variety rating not set"
                }
            }
            temp = parseFloatParam("rating_reliability", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating variety"
                    }
                }
                review['rating_reliability'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Reliability rating not set"
                }
            }
            temp = parseFloatParam("rating_service_and_quality", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating service and quality"
                    }
                }
                review['rating_service_and_quality'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Service & Quality rating not set"
                }
            }
            temp = parseFloatParam("pricing", event);
            if (temp !== null) {
                if (temp < 0 | temp > 3) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid pricing"
                    }
                }
                review['pricing'] = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Pricing not set"
                }
            }
            temp = JSON.parse(parseParam("diets", event));
            if (temp !== null) {
                diets = temp;
            }
            else {
                throw {
                    'statusCode': 400,
                    'error': "Diets not set"
                }
            }

            await postReview(client, ownUserId, restaurantId, review, images, diets);

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
