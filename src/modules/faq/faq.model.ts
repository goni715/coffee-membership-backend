import { model, Schema } from "mongoose";
import { IFaq } from "./faq.interface";
import { FAQ_CATEGORY, FAQ_CATEGORY_VALUES } from "./faq.constant";

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
        enum: FAQ_CATEGORY_VALUES,
        default: FAQ_CATEGORY.GENERAL,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false
});

const FaqModel = model<IFaq>('Faq', faqSchema);
export default FaqModel;