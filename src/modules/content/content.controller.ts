import asyncHandler from "@/utils/asyncHandler";
import ContentService from "./content.service";
import { TContentType } from "./content.interface";

const createUpdateContent = asyncHandler(async (req, res) => {
    const result = await ContentService.createUpdateContent(req.body);

    res.status(200).json({
        success: true,
        message: 'Content is updated successfully',
        data: result,
    });
});


const getContentByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    const result = await ContentService.getContentByType(type as TContentType);

    res.status(200).json({
        success: true,
        message: 'Content retrieved successfully',
        data: result,
    });
});




const ContentController = {
    createUpdateContent,
    getContentByType,
};
export default ContentController;