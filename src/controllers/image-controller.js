const { Image, Product } = require("../db");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  createImageInDataBase,
} = require("../utils/image-util");

const uploadImages = async (files) => {
  try {
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
    throw new Error(`Error uploading images: ${error}`);
  }
};

const deleteImages = async (imagesToDelete) => {
  try {
    if (imagesToDelete.length)
      await Promise.all(
        imagesToDelete
          .map((image) => JSON.parse(image))
          .map(async (image) => {
            await deleteImageFromCloudinary(image.publicId);
            await Image.destroy({ where: { id: image.id } });
          })
      );
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
