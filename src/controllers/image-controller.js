const { Image } = require("../db");
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
    if (imagesToDelete.length) {
      await Promise.all(
        imagesToDelete.map(async (image) => {
          const parsedImage = JSON.parse(image);
          if (!parsedImage.publicId) {
            await Image.destroy({ where: { id: parsedImage.id } });
            return;
          }
          await deleteImageFromCloudinary(parsedImage.publicId);
          await Image.destroy({ where: { id: parsedImage.id } });
        })
      );
    }
    return "Images deleted successfully";
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

module.exports = {
  uploadImages,
  deleteImages,
};
