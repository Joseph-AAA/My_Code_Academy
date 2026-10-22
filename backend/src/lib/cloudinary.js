import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
  throw new Error("CLOUDINARY_URL is missing");
}

cloudinary.config({
  cloudinary_url: cloudinaryUrl,
});

export default cloudinary;