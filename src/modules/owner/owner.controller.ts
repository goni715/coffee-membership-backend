import asyncHandler from "@/utils/asyncHandler";
import OwnerService from "./owner.service";
import pickValidFields from "@/utils/pickValidFields";
import { OWNER_VALID_FIELDS } from "./owner.constant";


const createOwner = asyncHandler(async (req, res) => {
  const result = await OwnerService.createOwner(req.body);
  res.status(200).json({
    success: true,
    message: "Owner is created successfully",
    data: result,
  });
});

const getOwners = asyncHandler(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, OWNER_VALID_FIELDS);
  const result = await OwnerService.getOwners(validatedQuery);
  res.status(200).json({
    success: true,
    message: "Owners are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateOwner = asyncHandler(async (req, res) => {
  const result = await OwnerService.updateOwner(req.body);
  res.status(200).json({
    success: true,
    message: "Owner is updated successfully",
    data: result,
  });
});

const OwnerController = {
    createOwner,
    getOwners,
    updateOwner
}

export default OwnerController;