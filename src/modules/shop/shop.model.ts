import { Schema, model } from "mongoose";
import { IShop } from "./shop.interface";
import { SHOP_STATUSES } from "./shop.constant";

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ownerId is required"],
      index: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    dailyBenefitDescription: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      required: [true, "QR code is required"],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SHOP_STATUSES),
      default: SHOP_STATUSES.INACTIVE,
      index: true
    },
    totalActiveCustomers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


// compound index to get newest shops
shopSchema.index({ createdAt: -1 });

// compound index to query shops by owner and status
shopSchema.index({ ownerId: 1, status: 1 });

const ShopModel = model<IShop>("Shop", shopSchema);
export default ShopModel;
