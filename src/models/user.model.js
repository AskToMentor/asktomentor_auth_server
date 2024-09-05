/* eslint-disable require-path-exists/exists */
"use strict";

const mongoose = require("mongoose");
const RolesEnum = require("../../utils/roles.js");
const userSchema = new mongoose.Schema(
    {
        accountApprovedTime: {
            type: Date
        },
        accountApprovedTimeInSecond: {
            type: Number
        },
        accountBlocked: {
            default: false,
            type: Boolean 
        },
        accountBlockedMessage: {
            type: String
        },
        accountBlockedTime: {
            type: Date
        },
        accountBlockedTimeInSecond: {
            type: Number
        },
        address: {
            type: String
        },
        city: {
            type: String 
        },
        countryCode: {
            type: String
        },
        countryName: {
            type: String
        },
        dayNumber: {
            required: true,
            type: Number 
        },
        deleteTime: {
            type: Number
        },
        deletionReason: {
            type: String
        },
        dialCode: {
            required: true,
            type: String
        },
        emailVerificationCode: {
            type: String
        },
        emailVerificationTime: {
            type: Date
        },
        emailVerificationTimeInSecond: {
            type: Number
        },
        emailVerified: {
            default: "Pending",
            type: String
        },
        firstName: {
            required: false,
            type: String
        },
        isDocumentUploaded: {
            default: false,
            required: true,
            type: Boolean 
        },
        lastName: {
            required: false,
            type: String
        },
        linkdein_full_name: {
            type: String
        },
        loginCount: {
            type: Number
        },
        monthNumber: {
            required: true,
            type: Number
        }, 
        phoneNumber: {
            required: true,
            type: String
        },
        pincode: {
            type: Number
        },
        profileImageUrl: {
            type: String
        },
        profileViedoUrl: {
            type: String
        },
        roles: {
            default: RolesEnum.USER,
            type: Number
        },
        stateCode: {
            required: false,
            type: String
        },
        userId: {
            required: true,
            type: String,
            unique: true
        },
        verified: {
            default: "Pending",
            type: String
        },
        weekNumber: {
            required: true,
            type: Number
        }
    },
    {
        timestamps: true 
    }
);

const User = mongoose.model("user", userSchema);

export default User;
