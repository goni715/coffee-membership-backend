import NotFoundError from "@/errors/NotFoundError";
import { IFaq, TFaqQuery } from "./faq.interface";
import FaqModel from "./faq.model";
import convertToSlug from "@/utils/convertToSlug";
import ConflictError from "@/errors/ConflictError";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { FAQ_SEARCHABLE_FIELDS } from "./faq.constant";

/*========== create FAQ ==========*/
const createFaq = async (
    payload: IFaq,
) => {
    const { question } = payload;
    const slug = convertToSlug(question);
    payload.slug = slug;

    //check faq is already exist
    const faq = await FaqModel.findOne({ slug });
    if (faq) {
        throw new ConflictError("This question is already existed");
    }

    //create faq
    const result = await FaqModel.create(payload);
    return result;
};

/*========== Get All FAQ ==========*/
const getFaqs = async (query: TFaqQuery) => {
    // destructuring
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ...filters  // Any additional filters
    } = query;

    // set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    //setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = makeSearchQuery(searchTerm, FAQ_SEARCHABLE_FIELDS);
    }

    //setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }

    const result = await FaqModel.aggregate([
        {
            $match: {
                ...searchQuery,
                ...filterQuery
            }
        },
        {
            $project: {
                slug: 0,
                updatedAt: 0
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);


    // total count
    const totalCountResult = await FaqModel.aggregate([
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
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
}

/*========== Get FAQ for User ==========*/
const getUserFaqs = async () => {
    const result = await FaqModel.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                slug: 0,
                createdAt: 0,
                isActive: 0,
                updatedAt: 0
            }
        },
    ]);
    return result;
}

/*========== Update FAQ ==========*/
const updateFaq = async (faqId: string, payload: Partial<IFaq>) => {
    //check faq
    const faq = await FaqModel.findById(faqId);
    if (!faq) {
        throw new NotFoundError("FAQ not found with the provided ID");
    }

    //check the already existed question
    if (payload?.question) {
        const slug = convertToSlug(payload.question);
        payload.slug = slug;
        const faqExist = await FaqModel.findOne({
            _id: { $ne: faqId },
            slug
        });
        if (faqExist) {
            throw new ConflictError("Sorry! This Question is already existed");
        }
    }

    //update faq
    const result = await FaqModel.updateOne(
        { _id: faqId },
        payload,
        { runValidators: true }
    );

    return result;
};

/*========== Delete FAQ ==========*/
const deleteFaq = async (faqId: string) => {
    const faq = await FaqModel.findById(faqId);
    if (!faq) {
        throw new NotFoundError("Faq not found with the provided ID");
    }

    //delete faq
    const result = await FaqModel.deleteOne({ _id: faqId });
    return result;
};



const FaqService = {
    createFaq,
    getFaqs,
    getUserFaqs,
    updateFaq,
    deleteFaq
}

export default FaqService;
