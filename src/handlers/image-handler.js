const {
  createImageController,
  updateImageController,
  deleteImageController,
  uploadImagesController,
} = require("../controllers/image-controller");

const createImage = async (req, res) => {
  try {
    const imageData = req.body;
    const newImage = await createImageController(imageData);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = req.body;
    const updateImage = await updateImageController(id, imageData);
    res.status(200).json(updateImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteImageController(id);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const files = req.files;
    const { id } = req.params;
    const uploadedImages = await uploadImagesController(id, files);
    res.status(201).json(uploadedImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createImage,
  updateImage,
  deleteImage,
  uploadImages,
};
