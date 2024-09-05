"use strict";

const {
    basicConfigurationObject, statusCodeObject, errorAndSuccessCodeConfiguration, CommonMessage
} = require("../utils/constants.js");

const ApiResponse = require("../utils/apiSuccess.js");
const ApiError = require("../utils/apiError.js");

const jsonwebtoken = require("jsonwebtoken");

const helper =  require("../utils/helper.js");
const fieldValidator = require("../utils/fieldValidator.js");
const storeSession = require("../utils/storeSession.js");

const ShortUniqueId =  require("short-unique-id");
const uid = new ShortUniqueId();

function convertStringToMilliseconds(timeString) {
    const match = timeString.match(/(\d+)([hms])/);

    if (!match) {
        // Handle invalid input or return default value
        return null;
    }

    const [ , value,
        unit ] = match;
    const numericValue = parseInt(value, 10);

    switch (unit) {
        case "h":
            return numericValue * 60 * 60 * 1000; // Convert hours to milliseconds
        case "m":
            return numericValue * 60 * 1000; // Convert minutes to milliseconds
        case "s":
            return numericValue * 1000; // Convert seconds to milliseconds
        default:
            // Handle unknown unit or return default value
            return null;
    }
}
const createToken =  async(req, res) => {
    console.log("req", req.headers);
    console.log("req body", req.body);

    try {
        const user_id = req.body.user_id;
        const role = req.body.role;
        const ip = req.headers.ip;
        const email = req.body.email;
        const userAgent = req.headers["user-agent"];

        if (fieldValidator(role) || fieldValidator(userAgent)) throw new ApiError(statusCodeObject.HTTP_STATUS_BAD_REQUEST, errorAndSuccessCodeConfiguration.HTTP_STATUS_BAD_REQUEST, CommonMessage.ERROR_FIELD_REQUIRED);

        if (fieldValidator(user_id) && fieldValidator(email)) throw new ApiError(statusCodeObject.HTTP_STATUS_BAD_REQUEST, errorAndSuccessCodeConfiguration.HTTP_STATUS_BAD_REQUEST, CommonMessage.ERROR_FIELD_REQUIRED);

        const originUrl = req.headers.originUrl;
        const platform = req.headers.platform;
        const uniqueId = uid.stamp(32);
        const tokenExpiry = basicConfigurationObject.ACCESS_TOKEN_EXPIRY;
        const data = {
            email,
            ip,
            jwtId: uniqueId,
            originUrl: originUrl || "railkafe",
            platform,
            role,
            user_id,
            userAgent
        };

        const jwtOption = {
            algorithm: "HS256",
            audience: data.originUrl,
            expiresIn: tokenExpiry, 
            issuer: basicConfigurationObject.JWT_ISSSUER,
            jwtid: uniqueId
        };

        const encrypt = await helper.encryptAnyData(data);

        data.encrypt = encrypt;
        const token = jsonwebtoken.sign({
            encrypt
        }, basicConfigurationObject.ACCESS_TOKEN_SECRET, jwtOption);
        const match = tokenExpiry.match(/\d/);
        const exipryHr = (match) ? Number(match[0]) : "";
        const milliseconds = convertStringToMilliseconds(tokenExpiry);

        console.log("token", data, jwtOption, exipryHr, milliseconds);

        await storeSession(data, jwtOption, exipryHr, milliseconds);

        return res.status(200).json(
            new ApiResponse(statusCodeObject.HTTP_STATUS_OK, errorAndSuccessCodeConfiguration.HTTP_STATUS_OK,
                {
                    token
                }, "Token Genrate Successfully")
        );
    }
    catch (error) {
        console.error("Error while creating Token", error);
        throw error;
    }
};
    
module.exports = createToken;