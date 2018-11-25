
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
            jsonObj = JSON.parse(JSON.stringify(res.rows)); 
        }
    }
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
            jsonObj = JSON.parse(JSON.stringify(res.rows)); 
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
            jsonObj = JSON.parse(JSON.stringify(res.rows));
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
            jsonObj = JSON.parse(JSON.stringify(res.rows));
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
                VALUES ($1, $4)`,
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
            if (arrayIndex > 4) {
                columns += ', ';
            }
            columns += key + ' = $' + arrayIndex.toString();
            values.push(changes[key]);
            arrayIndex++;
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
                        'error': "Invalid rating"
                    }
                }
                changes['rating_overall'] = temp;
            }
            temp = parseFloatParam("rating_variety", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating"
                    }
                }
                changes['rating_variety'] = temp;
            }
            temp = parseFloatParam("rating_service_and_quality", event);
            if (temp !== null) {
                if (temp < 0 | temp > 5) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating"
                    }
                }
                changes['rating_service_and_quality'] = temp;
            }
            temp = parseFloatParam("pricing", event);
            if (temp !== null) {
                if (temp < 0 | temp > 3) {
                    throw {
                        'statusCode': 400,
                        'error': "Invalid rating"
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

