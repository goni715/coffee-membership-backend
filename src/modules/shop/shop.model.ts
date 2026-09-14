import { Schema, model } from "mongoose";
import { IShop } from "./shop.interface";
import { SHOP_STATUSES } from "./shop.constant";

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ownerId is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Name is required"],
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
    activationQrCode: {
      type: String,
      required: [true, "Activation QR code is required"],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SHOP_STATUSES),
      default: SHOP_STATUSES.INACTIVE,
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

const ShopModel = model<IShop>("Shop", shopSchema);
export default ShopModel;
