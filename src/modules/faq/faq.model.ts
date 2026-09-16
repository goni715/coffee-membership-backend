import { model, Schema } from "mongoose";
import { IFaq } from "./faq.interface";
import { FAQ_CATEGORIES } from "./faq.constant";

const faqSchema = new Schema<IFaq>({
    question: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: Object.values(FAQ_CATEGORIES),
        default: FAQ_CATEGORIES.GENERAL,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });

const FaqModel = model<IFaq>('Faq', faqSchema);
export default FaqModel;