import { Schema, model } from 'mongoose';
import { CONTENT_TYPE_VALUES } from './content.constant';
import { IContent } from './content.interface';

const contentSchema = new Schema<IContent>({
    type: {
        type: String,
        enum: CONTENT_TYPE_VALUES,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const ContentModel = model<IContent>('Content', contentSchema);
export default ContentModel;