exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "authorization,x-amz-date,x-amz-security-token,Content-Type,X-Api-Key",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
      "Access-Control-Allow-Origin": "*",
    },
    body: ""
  });
};

