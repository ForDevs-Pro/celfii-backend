const {
    updateDollarController,
  } = require("../controllers/dollar-controller");
  
  const updateDollar = async (req, res) => {
    try {
      const dollarValue = req.body;
      const response = await updateDollarController(dollarValue);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    updateDollar
  };
  