"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidatorExports = void 0;
const isValidEmail = (email) => {
    // Check for the presence of "@" and "."
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email.length) {
        return false;
    }
    // Check for spaces or other invalid characters
    const invalidChars = /[^a-zA-Z0-9.@_-]/;
    if (invalidChars.test(email)) {
        return false;
    }
    // Check for consecutive dots in the domain name
    const domainParts = email.split("@")[1].split(".");
    for (let i = 0; i < domainParts.length; i++) {
        if (domainParts[i] === "" || (i > 0 && domainParts[i - 1] === domainParts[i])) {
            return false;
        }
    }
    return true;
};
exports.emailValidatorExports = {
    isValidEmail: isValidEmail
};
