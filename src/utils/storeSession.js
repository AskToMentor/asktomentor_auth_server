"use strict";

const {
    Session
} = require("../models/index.js");

const storeSession = async(data, jwtOption, expiry_hr, milliseconds) => {
    console.log("storeSession working", expiry_hr, milliseconds);
    try {
        const currentTime = new Date().getTime();
        const obj = {
            created: new Date().getTime(),
            email: data.email,
            enabled: true,
            encrypt: data.encrypt,
            expiry_hr,
            expiry_time: milliseconds + currentTime,
            ip: data.ip,
            jwt_id: jwtOption.jwtid,
            original_url: data.originUrl,
            platform: data.platform,
            role: data.role,
            user_agent: data.userAgent,
            user_id: data.user_id
        };

        console.log(obj);
        await Session.create(obj);
    }
    catch (error) {
        console.error("Creating Errror", error); 
        throw error;
    }
};

module.exports = storeSession;