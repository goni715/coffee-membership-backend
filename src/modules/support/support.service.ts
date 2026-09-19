import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { ISupport, TSupportQuery } from "./support.interface";
import SupportModel from "./support.model";
import { SUPPORT_SEARCHABLE_FIELDS, SUPPORT_STATUSES } from "./support.constant";
import ConflictError from "@/errors/ConflictError";
import NotFoundError from "@/errors/NotFoundError";


/* ==================== Create Support ==================== */
const submitSupportRequest = async (userId: string, payload: ISupport) => {
    const result = await SupportModel.create({
        userId,
        title: payload.title,
        message: payload.message,
    });
    return result;
};


/* ==================== Get Supports ==================== */
const getSupports = async (query: TSupportQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters  // Any additional filters
    } = query;

    // setup pagination
    const skip = (Number(page) - 1) * Number(limit);

    // setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, SUPPORT_SEARCHABLE_FIELDS);
    }

    // setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }
    const result = await SupportModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            },
        },
        {
            $project: {
                updatedAt: 0
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]).collation({ locale: "en", strength: 2 });

    // total count
    const totalCountResult = await SupportModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
        { $count: "totalCount" }
    ])

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
};

/* ==================== Reply Support ==================== */
const replySupport = async (supportId: string, replyMessage: string) => {
    const support = await SupportModel.findById(supportId);
    if (!support) {
        throw new NotFoundError("Support not found with the provided ID");
    }

    //check already replied
    if (support.replyMessage) {
        throw new ConflictError("Reply message already sent.")
    }

    //update contact
    const result = await SupportModel.updateOne(
        { _id: supportId },
        { replyMessage, replyAt: new Date(), status: SUPPORT_STATUSES.REPLIED },
        { runValidators: true }
    );

    //send reply email
    // await sendReplyEmail(support.email, replyMessage);
    return result;
};

/* ==================== Close Support ==================== */
const closeSupport = async (supportId: string) => {
    const support = await SupportModel.findById(supportId);
    if (!support) {
        throw new NotFoundError("Support not found with the provided ID");
    }

    //check replyMessage has not been sent yet
    if (support.status !== SUPPORT_STATUSES.REPLIED) {
        throw new ConflictError("Reply message has not been sent yet.")
    }

    //update contact
    const result = await SupportModel.updateOne(
        { _id: supportId },
        { status: SUPPORT_STATUSES.CLOSED },
        { runValidators: true }
    );

    return result;
};

/* ==================== Delete Support ==================== */
const deleteSupport = async (supportId: string) => {
    const support = await SupportModel.findById(supportId);
    if (!support) {
        throw new NotFoundError("Support not found with the provided ID");
    }

    //delete
    const result = await SupportModel.deleteOne({ _id: supportId });
    return result;
};



const SupportService = {
    submitSupportRequest,
    getSupports,
    replySupport,
    deleteSupport,
    closeSupport
}

export default SupportService;