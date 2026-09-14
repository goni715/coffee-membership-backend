"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const isNotObjectId = (id) => {
    return !(mongoose_1.Types.ObjectId.isValid(id)); //true or false
};
exports.default = isNotObjectId;
