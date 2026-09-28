import { MEMBERSHIP_STATUSES } from './membership.constant';
import { IMembership } from './membership.interface';
import { model, Schema } from 'mongoose';


const membershipSchema = new Schema<IMembership>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer ID is required'],
            index: true
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner ID is required'],
            index: true
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: [true, 'Shop ID is required'],
            index: true
        },
        status: {
            type: String,
            enum: Object.values(MEMBERSHIP_STATUSES),
            default: MEMBERSHIP_STATUSES.PENDING,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);


const MembershipModel = model<IMembership>('Membership', membershipSchema);
export default MembershipModel;