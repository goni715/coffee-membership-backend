import { IContent, TContentType } from "./content.interface";
import ContentModel from "./content.model";

/*========================= create or update content =========================*/
const createUpdateContent = async (payload: IContent) => {
    const result = await ContentModel.findOneAndUpdate(
        { type: payload.type },
        { content: payload.content },
        { new: true, upsert: true, runValidators: true }
    ).select("-_id -createdAt");
    return result;
};

/*========================= get content by type =========================*/
const getContentByType = async (type: TContentType) => {
    const result = await ContentModel.findOne({ type }).select("-_id -createdAt");

    //if content not found
    if (!result) {
        const newContent = await ContentModel.create({
            type,
            content: '<p>Coming soon</p>'
        });

        return {
            type: newContent.type,
            content: newContent.content,
            updatedAt: newContent.updatedAt
        };
    }

    return result;
};



const ContentService = {
    createUpdateContent,
    getContentByType
}
export default ContentService