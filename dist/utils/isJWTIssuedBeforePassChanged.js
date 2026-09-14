"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJWTIssuedBeforePassChanged = void 0;
const isJWTIssuedBeforePassChanged = (passwordChangedTimestamp, jwtIssuedTimestamp) => {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000; //seconds
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.isJWTIssuedBeforePassChanged = isJWTIssuedBeforePassChanged;
