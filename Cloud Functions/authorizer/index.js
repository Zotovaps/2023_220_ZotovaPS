const jwt = require("jsonwebtoken");

exports.handler = async function (event, context) {
    let response = {
        "isAuthorized": false
    };

    if (event.httpMethod === "PUT") {
        const env_data = process.env.USER.split(":")
        const body = JSON.parse(event.body)

        if (body.login === env_data[0] && body.password === env_data[1]) {
            const tokenData = {
                "login": body.login
            }

            return {
                "statusCode": 200,
                "body": jwt.sign(tokenData, process.env.SECRET, {expiresIn: process.env.TIMEOUT}),
            }
        }
        else {
            return {
                "statusCode": 200,
                "body": false
            }
        }
    }
    else {
        const token = event.headers.Authorization.replace(/^Bearer\s+/, "");

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET)

                if (decoded) {
                    response = {
                        "isAuthorized": true
                    };
                }
            } catch (err) {
                //err
            }


        }
    }

    return response;
};