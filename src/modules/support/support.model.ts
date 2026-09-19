import { Schema, model } from 'mongoose';
import { ISupport } from './support.interface';
import { SUPPORT_STATUSES } from './support.constant';

const supportSchema = new Schema<ISupport>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
    },
    title: {
        type: String,
        required: [true, "title is required"],
        trim: true,
        maxlength: 150,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: 1000,
    },
    replyMessage: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
    },
    replyAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(SUPPORT_STATUSES),
        default: SUPPORT_STATUSES.NEW,
    },
}, {
    timestamps: true,
    versionKey: false
})

const SupportModel = model<ISupport>('Support', supportSchema);
export default SupportModel;