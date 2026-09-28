import { Schema, model } from 'mongoose';
import { IRedemption } from './redemption.interface';


const redemptionSchema = new Schema<IRedemption>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop ID is required'],
      index: true,
    },
    qrCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);


// compound index to find the latest redemption for a customer at a shop
redemptionSchema.index({ customerId: 1, shopId: 1, createdAt: -1 });


const RedemptionModel = model<IRedemption>('Redemption', redemptionSchema);
export default RedemptionModel;