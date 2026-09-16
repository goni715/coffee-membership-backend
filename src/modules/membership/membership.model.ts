import { IMembership } from './membership.interface';
import { Schema } from 'mongoose';

export enum MembershipRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PAUSED = 'PAUSED',
    CANCELLED = 'CANCELLED',
}

const membershipSchema = new Schema<IMembership>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer ID is required'],
            index: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: [true, 'Shop ID is required'],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(MembershipRequestStatus),
            default: MembershipRequestStatus.PENDING,
            index: true,
        },
        requestDate: {
            type: Date,
            default: Date.now,
        },
        actionDate: {
            type: Date,
            default: null,
        },
        statusReason: {
            type: String,
            default: null,
        },
    },
    { timestamps: true, versionKey: false }
);


