const { cloudinary, uploadFolder } = require("../config/cloudinary-config");

const uploadToCloudinary = (buffer) => {
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

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new Error("Error deleting image from Cloudinary");
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
