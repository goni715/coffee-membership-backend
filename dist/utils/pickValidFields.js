"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pickValidFields = (queryObj, keys) => {
    const validFieldsObject = {};
    const queryObjArray = Object.keys(queryObj);
    if (queryObjArray.length > 0) {
        queryObjArray.forEach((key) => {
            if (keys.includes(key) && queryObj[key]) {
                validFieldsObject[key] = queryObj[key];
            }
        });
    }
    return validFieldsObject;
};
exports.default = pickValidFields;
