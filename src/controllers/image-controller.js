const { Image } = require("../db");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  createImageInDataBase,
} = require("../utils/image-util");

const uploadImages = async (files) => {
  try {
    files = Array.isArray(files) ? files : [files].filter(Boolean);

    const validFiles = files.filter((file) => file && file.buffer);

    if (validFiles.length) {
      const uploadPromises = validFiles.map((file) => uploadImageToCloudinary(file.buffer));
      const uploadedImages = await Promise.all(uploadPromises);
      const createPromises = uploadedImages.map((image) => createImageInDataBase(image));
      const imageInstances = await Promise.all(createPromises);
      return imageInstances;
    } else {
      const createPromises = files.map((image) => createImageInDataBase(image));
      const imageInstances = await Promise.all(createPromises);
      return imageInstances;
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error(`Error uploading images: ${error.message}`);
  }
};

const deleteImages = async (imagesToDelete) => {
  try {
    if (imagesToDelete.length) {
      await Promise.all(
        imagesToDelete
          .map((image) => JSON.parse(image))
          .map(async (image) => {
            if (image.publicId) {
              await deleteImageFromCloudinary(image.publicId);
            } else {
              console.warn(
                `Image with id ${image.id} has no publicId, skipping Cloudinary deletion.`
              );
            }
            await Image.destroy({ where: { id: image.id } });
          })
      );
    }
    return "Images deleted successfully";
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Error deleting image: ${error}`);
  }
};

module.exports = {
  uploadImages,
  deleteImages,
};
