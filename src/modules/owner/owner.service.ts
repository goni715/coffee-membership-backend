import config from "@/config";
import ConflictError from "@/errors/ConflictError";
import { IUser } from "@/modules/user/user.interface";
import UserModel from "@/modules/user/user.model";
import { ACCOUNT_STATUSES, USER_ROLES } from "../user/user.constant";
import { makeFilterQuery, makeSearchQuery } from "@/helpers/QueryBuilder";
import { TOwnerQuery } from "./owner.interface";
import { OWNER_SEARCHABLE_FIELDS } from "./owner.constant";
import { PipelineStage } from "mongoose";



/*=========== create owner ============*/
const createOwner = async (payload: IUser) => {
  const { email, password } = payload;

  //check user
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new ConflictError("An account with this email already exists.");
  }

  if (!password) {
    payload.password = config.admin.owner_default_password as string;
  }

  //create owner
  const result = await UserModel.create({
    ...payload,
    role: USER_ROLES.OWNER,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    status: ACCOUNT_STATUSES.ACTIVE,
  });

  const { _id, fullName, email: Email, role } = result;

  return {
    _id,
    fullName,
    email: Email,
    role,
  };
};


/*============== get owners ================== */
const getOwners = async (query: TOwnerQuery) => {

  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "desc",
    sortBy = "createdAt",
    ...filters // additional filters
  } = query;

  // 1. set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //2. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //3. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, OWNER_SEARCHABLE_FIELDS);
  }

  //4 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  //common pipeline stage
  const commonPipeline: PipelineStage = {
    $match: {
      role: USER_ROLES.OWNER,
      ...searchQuery,
      ...filterQuery,
    },
  }

  const owners = await UserModel.aggregate([
    commonPipeline,
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        profileImg: 1,
        status: 1,
        lastLoginAt: 1,
        createdAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count
  const totalCountResult = await UserModel.aggregate([
    commonPipeline,
    { $count: "totalCount" },
  ]);

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

  const result = {
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalPages,
      total: totalCount,
    },
    data: owners,
  };

  return result;
};


/*============== update owner ================== */
const updateOwner = async (ownerId: string, payload: Partial<IUser>) => {
  return payload;
}
/*============== delete owner ================== */
const deleteOwner = async (ownerId: string) => {
  return ownerId;
}


const OwnerService = {
  createOwner,
  getOwners,
  updateOwner,
  deleteOwner
}

export default OwnerService;