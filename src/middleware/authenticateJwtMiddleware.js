"use strict";

const {
    CommonMessage, statusCodeObject, errorAndSuccessCodeConfiguration
} = require("../utils/constants.js");
const ApiError = require("../utils/apiError.js");
const jsonwebtoken = require("jsonwebtoken");
const helper = require("../utils/helper.js");
const fieldValidator = require("../utils/fieldValidator.js");
const ApiResponse = require("../utils/apiSuccess.js");
const fs = require("fs");
const Session = require("../models/session.model");
const User = require("../models/user.model");

const authenticateJwtMiddleware =  async(req, res) => {
    console.log("authenticateJwtMiddleware");
    const authHeader = req.headers.authorization;
    // const ip = req.headers.ip;

    try {
        if (!authHeader) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Authorization header is missing");

        const tokenParts = authHeader.split(" ");
        
        if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Invalid Authorization header format");
        
        const token = tokenParts[1];

        // console.log("token", token);
        
        const currentTime = new Date().getTime();
        const publicKey = fs.readFileSync("public.key", "utf8");
        // Verify the token using the secret key (replace 'your_secret_key' with your actual secret key)
        const decoded = jsonwebtoken.verify(token, publicKey, {
            algorithms: [ "RS256" ] 
        });

        // console.log({
        //     authHeader,
        //     decoded,
        //     tokenParts
        // });

        // console.log("decoded", decoded);
        const encryptObj = await helper.decryptAnyData(decoded.encrypt);

        // if (encryptObj.ip !== ip) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "unauthorized Token");

        if (currentTime > encryptObj.expiryTime) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Token Expired");

        // Attach the decoded payload to the request for later use in routes
        delete encryptObj.originalUrl;

        const user = await User.findOne({
            userId: encryptObj.userId
        });

        if (user.accountBlocked || user.accountBlocked === "1") throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Account Blocked");

        const SessionObj =  await Session.findOne({
            jwtId: encryptObj.jwtId,
            userId: encryptObj.userId
        
        });
        
        if (fieldValidator(SessionObj)) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Session Expired");
        
        if (!SessionObj.enabled) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Session Expired");

        if (currentTime > SessionObj.expiry_time) throw new ApiError(statusCodeObject.HTTP_STATUS_UNAUTHORIZED, errorAndSuccessCodeConfiguration.HTTP_STATUS_UNAUTHORIZED, "Session Expired");

        return res.status(200).json(
            new ApiResponse(statusCodeObject.HTTP_STATUS_OK, errorAndSuccessCodeConfiguration.HTTP_STATUS_OK,
                {
                    encryptObj
                }, "Token Genrate Successfully")
        );
    }
    catch (error) {
        console.error("Error while Login User", error.message);
        // await session.abortTransaction();

        if (error instanceof ApiError) {
            console.log("Api Error instance");

            // Handle ApiError instances with dynamic status code and message
            return res.status(error.statusCode).json({
                error: error || CommonMessage.SOMETHING_WENT_WRONG
            });
        }
        else {
            // Handle other types of errors
            console.error("Error in loginUser:", error);

            return res.status(statusCodeObject.HTTP_STATUS_UNAUTHORIZED).json({
                error: "Invalid token" 
            });
        }
    }
};

module.exports = authenticateJwtMiddleware;