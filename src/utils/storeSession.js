"use strict";

const Session = require("../models/session.model");

const storeSession = async(data, jwtOption, expiry_hr, milliseconds) => {
    console.log("storeSession working", expiry_hr, milliseconds);
    try {
        const currentTime = new Date().getTime();
        const obj = {
            created: new Date().getTime(),
            email: data.email,
            enabled: true,
            encrypt: data.encrypt,
            exipryHr: expiry_hr,
            expiryTime: milliseconds + currentTime,
            ip: data.ip,
            jwtId: jwtOption.jwtid,
            originalUrl: data.originUrl,
            platform: data.platform,
            role: data.role,
            user_agent: data.userAgent,
            userId: data.userId
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