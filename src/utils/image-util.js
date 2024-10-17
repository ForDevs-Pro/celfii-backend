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

module.exports = { uploadToCloudinary };
