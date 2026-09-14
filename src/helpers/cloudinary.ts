import config from "@/config";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.cloud_api_key,
    api_secret: config.cloudinary.cloud_api_secret_key
});

export default cloudinary;