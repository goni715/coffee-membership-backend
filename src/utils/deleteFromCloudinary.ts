import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (
    publicId: string
): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        throw err;
    }
};

export default deleteFromCloudinary;