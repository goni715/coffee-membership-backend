/* eslint-disable @typescript-eslint/no-explicit-any */

import cloudinary from "@/helpers/cloudinary";

export type TFolder = 'user' | 'shop';

const uploadToCloudinary = async (path: string, folder: TFolder) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: `Coffee/${folder}`,
    });

    return {
      img_url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (err: any) {
    throw new Error(err);
  }
};

export default uploadToCloudinary;