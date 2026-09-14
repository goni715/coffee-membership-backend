"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const user_constant_1 = require("../user/user.constant");
const QueryBuilder_1 = require("../../helpers/QueryBuilder");
const owner_constant_1 = require("./owner.constant");
const NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
const shop_model_1 = __importDefault(require("../shop/shop.model"));
/*=========== create owner ============*/
const createOwner = async (payload) => {
    const { email, password } = payload;
    //check user
    const user = await user_model_1.default.findOne({ email });
    if (user) {
        throw new ConflictError_1.default("An account with this email already exists.");
    }
    if (!password) {
        payload.password = config_1.default.admin.owner_default_password;
    }
    //create owner
    const result = await user_model_1.default.create({
        ...payload,
        role: user_constant_1.USER_ROLES.OWNER,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        status: user_constant_1.ACCOUNT_STATUSES.ACTIVE,
    });
    const { _id, fullName, email: Email, role } = result;
    return {
        _id,
        fullName,
        email: Email,
        role,
    };
};
/*============== get owners ================== */
const getOwners = async (query) => {
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt", ...filters // additional filters
     } = query;
    // 1. set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //2. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //3. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, owner_constant_1.OWNER_SEARCHABLE_FIELDS);
    }
    //4 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //common pipeline stage
    const commonPipeline = {
        $match: {
            role: user_constant_1.USER_ROLES.OWNER,
            ...searchQuery,
            ...filterQuery,
        },
    };
    const owners = await user_model_1.default.aggregate([
        commonPipeline,
        {
            $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phone: 1,
                profileImg: 1,
                status: 1,
                lastLoginAt: 1,
                createdAt: 1,
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = await user_model_1.default.aggregate([
        commonPipeline,
        { $count: "totalCount" },
    ]);
    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    const result = {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: owners,
    };
    return result;
};
/*============== update owner ================== */
const updateOwner = async (ownerId, payload) => {
    //check owner
    const owner = await user_model_1.default.findOne({
        role: user_constant_1.USER_ROLES.OWNER,
        _id: ownerId
    });
    if (!owner) {
        throw new NotFoundError_1.default("Owner not found with the provided ID");
    }
    //update owner
    const result = await user_model_1.default.updateOne({ _id: ownerId }, payload);
    return result;
};
/*============== delete owner ================== */
const deleteOwner = async (ownerId) => {
    //check owner
    const owner = await user_model_1.default.findOne({
        role: user_constant_1.USER_ROLES.OWNER,
        _id: ownerId
    });
    if (!owner) {
        throw new NotFoundError_1.default("Owner not found with the provided ID");
    }
    //check owner is associated with shop
    const associatedWithShop = await shop_model_1.default.findOne({ ownerId });
    if (associatedWithShop) {
        throw new ConflictError_1.default("Unable to delete. This owner is associated with an existing shop.");
    }
    //delete owner
    const result = await user_model_1.default.deleteOne({ _id: ownerId });
    return result;
};
const OwnerService = {
    createOwner,
    getOwners,
    updateOwner,
    deleteOwner
};
exports.default = OwnerService;
