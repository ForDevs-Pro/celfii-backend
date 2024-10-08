const { getSheetDataController } = require('../controllers/api-controller');

const getSheetData = async (req, res) => {
  try {
    const response = await getSheetDataController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSheetData };
