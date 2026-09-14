"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToSlug = (value) => {
    const trimmedString = value.trim();
    const hyphenatedString = trimmedString.replace(/\s+/g, '-'); //Replace all remaining whitespace characters with hyphens
    return hyphenatedString.toLowerCase();
};
exports.default = convertToSlug;
