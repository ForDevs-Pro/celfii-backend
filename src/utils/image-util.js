const { cloudinary, uploadFolder } = require("../config/cloudinary-config");
const { Image } = require("../db");

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: uploadFolder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const stream = require("stream");
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new Error("Error deleting image from Cloudinary");
  }
};

const createImageInDataBase = async (imageData) => {
  try {
    const newImage = await Image.create({
      url: imageData.secure_url || imageData.url,
      width: imageData.width,
      height: imageData.height,
      format: imageData.format,
      publicId: imageData.public_id,
    });
    return newImage;
  } catch (error) {
    console.error("Error creating image in DataBase:", error);
    throw new Error(`Error creating image in DataBase: ${error}`);
  }
};

module.exports = { createImageInDataBase, uploadImageToCloudinary, deleteImageFromCloudinary };
