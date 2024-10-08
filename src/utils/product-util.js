const { View, Image, Caetgory } = require("../db");
const { Op } = require("sequelize");

const orderOptions = {
  "most popular": [["view", "DESC"]],
  "highest price": [["price", "DESC"]],
  "lowest price": [["price", "ASC"]],
};

const getProductData = ({ name, sort, page = 1, pageSize = 10, showDeleted = false }) => {
  const order = orderOptions[sort] || [];
  const include = getProductIncludes();
  const limit = Math.max(parseInt(pageSize, 10), 1);
  const offset = Math.max((parseInt(page, 10) - 1) * limit, 0);
  const where = {
    ...(showDeleted ? {} : { deletedAt: null }),
    ...(name && { [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }] }),
  };

  return {
    limit,
    offset,
    order,
    where,
    include,
  };
};

const getProductIncludes = () => [
  { model: View, as: "view" },
  // { model: Image, as: "images" },
  // { model: Caetgory, as: "category" },
];

module.exports = { getProductData, getProductIncludes };
