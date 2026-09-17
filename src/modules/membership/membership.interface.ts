import { Types } from "mongoose";
import { MEMBERSHIP_STATUSES } from "./membership.constant";

export type TMembershipStatus = typeof MEMBERSHIP_STATUSES[keyof typeof MEMBERSHIP_STATUSES];

export interface IMembership extends Document {
    customerId: Types.ObjectId;
    ownerId: Types.ObjectId;
    shopId: Types.ObjectId;
    status: TMembershipStatus;
}