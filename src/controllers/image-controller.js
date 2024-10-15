const { Image } = require("../db");
const { uploadToCloudinary } = require("../utils/image-util");

const createImageController = async (imageData) => {
  try {
    const [newImage, created] = await Image.findOrCreate({ where: imageData });
    if (!created) throw new Error("Image already exists");
    return newImage;
  } catch (error) {
    console.error("Error creating image:", error);
    throw new Error(`Error creating image: ${error}`);
  }
};

const updateImageController = async (id, imageData) => {
  try {
    const [affectedRows, updatedImages] = await Image.update(
      { url: imageData.url, altText: imageData.altText },
      { where: { id }, returning: true }
    );
    if (affectedRows === 0) throw new Error("Image not found");
    return updatedImages[0];
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error(`Error updating image: ${error}`);
  }
};

const deleteImageController = async (id) => {
  try {
    const imageToDelete = await Image.findByPk(id);
    if (!imageToDelete) throw new Error("Image not found");
    await imageToDelete.destroy();
    return "Image deleted successfully";
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Error deleting image: ${error}`);
  }
};

const uploadImagesController = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error(`Error uploading images: ${error}`);
  }
};

module.exports = {
  createImageController,
  updateImageController,
  deleteImageController,
  uploadImagesController,
};
