import { Document } from "mongoose";
import { FAQ_CATEGORIES } from "./faq.constant";

export type TFaqCategory = typeof FAQ_CATEGORIES[keyof typeof FAQ_CATEGORIES];

export interface IFaq extends Document {
    question: string;
    slug: string;
    answer: string;
    category: TFaqCategory;
    isActive: boolean;
};

export type TFaqQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: string;
    category?: TFaqCategory;
};


