import { Schema, model, Document } from 'mongoose';
import { IRedemption } from './redemption.interface';



const redemptionSchema = new Schema<IRedemption>(
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
    qrCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);


export const RedemptionToken = model<IRedemption>('Redemption', redemptionSchema);