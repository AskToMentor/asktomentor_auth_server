"use strict";

const {
    Router
} = require("express");

const router = Router();

const authenticateJwtMiddleware = require("../../middleware/authenticateJwtMiddleware.js");

router.route("/").get((req, res) => {
    res.status(200).json({
        message: "Health check passed",
        status: "OK" 
    });
});
module.exports =  router;