"use strict";

const {
    basicConfigurationObject
} = require("./constants.js");

console.log("basicConfigurationObject.JSON_STRINGIFY", typeof basicConfigurationObject.JSON_STRINGIFY,   basicConfigurationObject.JSON_STRINGIFY);
class ApiResponse {
    constructor(statusCode, successCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.successCode = successCode;
        this.data = (basicConfigurationObject.JSON_STRINGIFY === "false") ? data : JSON.stringify(data);
        this.message = message;
        this.success = statusCode < 400;
    }
}

module.exports = ApiResponse;
