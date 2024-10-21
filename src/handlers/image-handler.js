const {
  uploadImagesController,
  deleteImagesController,
} = require("../controllers/image-controller");

const uploadImages = async (req, res) => {
  try {
    const files = req.files;
    const { id } = req.params;
    const response = await uploadImagesController(id, files);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImages = async (req, res) => {
  try {
    const images = req.body;
    const response = await deleteImagesController(images);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImages,
  deleteImages,
};
