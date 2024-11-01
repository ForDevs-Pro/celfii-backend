const { Dollar } = require("../db");

const createDollarEntryController = async (rate) => {
  try {
    await Dollar.create({ rate });
    return 
  } catch (error) {
    console.error("Error creating dollar:", error.message);
    throw new Error("Error creating dollar");
  }
};

const updateDollarController = async (rate, date = new Date()) => {
  try {
    const dollar = await Dollar.findOne();
    if (dollar) {
      dollar.rate = rate;
      dollar.date = date;
      await dollar.save();
      return dollar;
    }
  } catch (error) {
    console.error("Error updating dollar:", error.message);
    throw new Error("Error updating dollar");
  }
};

module.exports = {
  createDollarEntryController,
  updateDollarController,
};
