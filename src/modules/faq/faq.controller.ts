import asyncHandler from "../../utils/asyncHandler";
import FaqService from "./faq.service";



const createFaq = asyncHandler(async (req, res) => {
    const result = await FaqService.createFaq(req.body);
    res.status(201).json({
        success: true,
        message: "FAQ is created successfully.",
        data: result
    })
})

const getFaqs = asyncHandler(async (req, res) => {
    const validatedQuery = (req as any).validatedQuery;
    const result = await FaqService.getFaqs(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'FAQs are retrieved successfully',
        meta: result.meta,
        data: result.data,
    })
})

const getUserFaqs = asyncHandler(async (req, res) => {
    const result = await FaqService.getUserFaqs();
    res.status(200).json({
        success: true,
        message: 'FAQs are retrieved successfully',
        data: result
    })
})

const updateFaq = asyncHandler(async (req, res) => {
    const { faqId } = req.params;
    const result = await FaqService.updateFaq(faqId as string, req.body);
    res.status(200).json({
        success: true,
        message: 'FAQ is updated successfully',
        data: result
    })
})

const deleteFaq = asyncHandler(async (req, res) => {
    const { faqId } = req.params;
    const result = await FaqService.deleteFaq(faqId as string);
    res.status(200).json({
        success: true,
        message: 'FAQ is deleted successfully',
        data: result
    })
})




const FaqController = {
    createFaq,
    getFaqs,
    getUserFaqs,
    updateFaq,
    deleteFaq
}

export default FaqController;