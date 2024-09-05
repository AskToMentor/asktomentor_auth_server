"use strict";

const  {
    Router
} = require( "express");

const router = Router();

const  createToken = require( "../../controllers/createToken.controller.js");
const  authenticate = require( "../../middleware/authenticateJwtMiddleware.js");
const authorisationMiddleware = require("../../middleware/authorisationMiddleware.js");

router.route("/").get((req, res) => {
    res.status(200).json({
        message: "Health check passed",
        status: "OK" 
    });
});
router.route("/createToken").post(createToken);
router.route("/authenticate").post(authenticate);
router.route("/authorize").post(authorisationMiddleware);

module.exports = router;