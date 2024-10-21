const { Image, Product } = require("../db");
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require("../utils/image-util");

const uploadImagesController = async (id, files) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) throw new Error(`Product with ID ${id} not found.`);
    const uploadPromises = files.map((file) => uploadImageToCloudinary(file.buffer));
    const uploadedImages = await Promise.all(uploadPromises);
    const createPromises = uploadedImages.map((image) => createImageController(image));
    const imageInstances = await Promise.all(createPromises);
    await product.addImages(imageInstances);
    return imageInstances;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error(`Error uploading images: ${error}`);
  }
};

const deleteImagesController = async (images) => {
  try {
    await Promise.all(
      images.map(async (image) => {
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
  uploadImagesController,
  deleteImagesController,
};
