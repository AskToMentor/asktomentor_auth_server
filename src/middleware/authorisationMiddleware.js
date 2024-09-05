"use strict";

const {
    CommonMessage, statusCodeObject, errorAndSuccessCodeConfiguration
} = require("../utils/constants.js");
const ApiError = require("../utils/apiError.js");
const fieldValidator = require("../utils/fieldValidator.js");

const ApiResponse = require("../utils/apiSuccess.js");

const authorisationMiddleware =  async(req, res) => {
    console.log("authorisationMiddleware", req.body);
    // const ip = req.headers.ip;

    try {
        let permission = req.body.permission;
        // const user_id = req.body.user_id;
        const userRole = req.body.userRole;

        if (fieldValidator(permission) || fieldValidator(userRole)) throw new ApiError(statusCodeObject.HTTP_STATUS_BAD_REQUEST, errorAndSuccessCodeConfiguration.HTTP_STATUS_BAD_REQUEST, CommonMessage.DETAIL_ALREADY_EXISTS);

        permission = permission.split(",");

        if (!permission.includes(userRole)) throw new ApiError(statusCodeObject.HTTP_STATUS_FORBIDDEN, errorAndSuccessCodeConfiguration.HTTP_STATUS_FORBIDDEN, "Do not have access to perform this action");

        console.log("body", req.body);

        return res.status(200).json(
            new ApiResponse(statusCodeObject.HTTP_STATUS_OK, errorAndSuccessCodeConfiguration.HTTP_STATUS_OK,
                {}, "Permission granted Successfully")
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

module.exports = authorisationMiddleware;