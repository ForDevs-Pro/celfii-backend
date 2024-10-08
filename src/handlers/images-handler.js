const {
  createImageController,
  updateImageController,
  deleteImageController,
} = require("../controllers/images-controller");

const createImage = async (req, res) => {
  try {
    const { url, alt } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const newImage = await createImageController(url, alt);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, alt } = req.body;

    const updateImage = await updateImageController(id, url, alt);
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

module.exports = {
  createImage,
  updateImage,
  deleteImage,
};
