const { Image } = require("../db");

const createImageController = async (url, alt) => {
  try {
    const [newImage, created] = await Image.findOrCreate({
      where: {
        url,
        alt,
      },
    });

    if (!created) {
      throw new Error("Image already exists");
    }
    return newImage;
  } catch (error) {
    console.error("Error creating image:", error);
    throw new Error("Image creation failed");
  }
};

const updateImageController = async (id, url, alt) => {
  try {
    const [affectedRows, updatedImages] = await Image.update(
      { url, alt },
      {
        where: { id },
        returning: true,
      }
    );

    if (affectedRows === 0) {
      throw new Error("Image not found");
      }
      console.log(updatedImages)
    return updatedImages[0];
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Image update failed");
  }
};

const deleteImageController = async (id) => {
  try {
    const imageToDelete = await Image.findByPk(id);
    if (!imageToDelete) {
      throw new Error("Image not found");
    }

    await imageToDelete.destroy();
    return "Image deleted successfully";
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Image deletion failed");
  }
};

module.exports = {
  createImageController,
  updateImageController,
  deleteImageController,
};
