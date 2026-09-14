"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_VALID_FIELDS = exports.USER_ROLES = exports.ACCOUNT_STATUSES = exports.USER_SEARCHABLE_FIELDS = void 0;
exports.USER_SEARCHABLE_FIELDS = ["fullName", "email", "address"];
exports.ACCOUNT_STATUSES = {
    PENDING: 'pending',
    ACTIVE: 'active',
    BLOCKED: 'blocked',
};
exports.USER_ROLES = {
    CUSTOMER: "customer",
    OWNER: "owner",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
};
exports.USER_VALID_FIELDS = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
];
