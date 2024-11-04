const {
    updateDollarController,
    getDollarController
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
  
  const getDollar = async (req, res) => {
    try {
      const dollar = await getDollarController();
      if (dollar) {
        res.status(200).json(dollar);
      } else {
        res.status(404).json({ error: "Dollar rate not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getDollarById = async (req, res) => {
    try {
      const dollar = await getDollarController(); 
      if (dollar) {
        res.status(200).json(dollar);
      } else {
        res.status(404).json({ error: "Dollar rate not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    updateDollar,
    getDollar,
    getDollarById
  };