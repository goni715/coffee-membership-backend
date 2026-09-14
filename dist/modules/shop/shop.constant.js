"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCODE_PREFIX = exports.SHOP_VALID_FIELDS = exports.SHOP_SEARCHABLE_FIELDS = exports.SHOP_STATUSES = void 0;
exports.SHOP_STATUSES = {
    ACTIVE: "active",
    SUSPENDED: "suspended",
    INACTIVE: "inactive",
};
exports.SHOP_SEARCHABLE_FIELDS = [
    "ownerName",
    "ownerEmail",
    "ownerPhone",
    "name",
    "contactNumber",
    "address",
    "description",
];
exports.SHOP_VALID_FIELDS = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
    "city",
];
exports.QRCODE_PREFIX = {
    SHOP: "SHOP",
    COFFEE: "COFFEE",
};
