const { createView } = require("../controllers/view-controller");
const { createCategoryController } = require("../controllers/category-controller");
const { uploadImages, deleteImages } = require("../controllers/image-controller");
const { createImageInDataBase } = require("./image-util");
const { Product, View, Image, Category, sequelize } = require("../db");
const { Op } = require("sequelize");

const defaultImageUrl =
  "https://lh5.googleusercontent.com/proxy/r3NcrOciq9UC0Zk-ARYD8AaIBJvvTv_gnH-Nz6gn3w7KrVP8GzUNvPciRFwm9EBFe6qPWTkzZWebSBtGM3t0WxaPVZIiD7e593MYklTVj6zvj2U0CDMzMrp05fC40JttzTIuHFCu32hhtG7xRnSaEctjkQKldC-hOqswFn_VHo6hoTJ9bLO8SbexXOaESYbt99VCZbfZzoy2";

const safeNumber = (value) => {
  if (Number(value) === 0) return 0;
  const parsedValue = Number(value);
  return !isNaN(parsedValue) ? parsedValue : null;
};

const orderOptions = {
  "most popular": [[{ model: View, as: "view" }, "counter", "DESC"]],
  "highest price": [["priceArs", "DESC"]],
  "lowest price": [["priceArs", "ASC"]],
  newest: [["createdAt", "DESC"]],
};

const getProductIncludes = () => [
  { model: View, as: "view" },
  { model: Image, as: "images" },
  { model: Category, as: "category" },
];

const getProductData = ({
  name,
  sort,
  page = 1,
  perPage = 10,
  onlyDeleted = false,
  minPrice,
  maxPrice,
  category,
}) => {
  const paranoid = !onlyDeleted;
  const limit = Math.max(parseInt(perPage, 10), 1);
  const offset = Math.max((parseInt(page, 10) - 1) * limit, 0);

  const where = {
    ...(onlyDeleted ? { deletedAt: { [Op.ne]: null } } : {}),
    ...(name && { [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }] }),
    ...(minPrice || maxPrice
      ? {
          priceArs: {
            ...(minPrice ? { [Op.gte]: parseFloat(minPrice) } : {}),
            ...(maxPrice ? { [Op.lte]: parseFloat(maxPrice) } : {}),
          },
        }
      : {}),
    ...(category && { "$category.name$": { [Op.iLike]: `%${category}%` } }),
  };

  const include = [
    { model: View, as: "view" },
    { model: Image, as: "images" },
    { model: Category, as: "category", required: !!category },
  ];

  const order =
    sort === "most popular"
      ? sequelize.literal(
          `(SELECT "counter" FROM "Views" WHERE "Views"."productId" = "Product"."id") DESC`
        )
      : orderOptions[sort] || [];

  return { limit, offset, order, where, include, paranoid };
};

const addProductAssociations = async ({ id, category, images }) => {
  try {
    await createView(id);
    const product = await Product.findByPk(id);

    if (images && images.length) {
      const imagesInstances = await uploadImages(images);
      await product.addImages(imagesInstances);
    } else {
      const imageInstance = await createImageInDataBase(defaultImageUrl);
      await product.addImage(imageInstance);
    }

    if (category) {
      const categoryInstances = await createCategoryController(category);
      await product.setCategory(categoryInstances);
    }
  } catch (error) {
    console.error("Error adding associations:", error.message);
    throw new Error(`Error adding associations: ${error.message}`);
  }
};

const setProductAssociations = async ({ id, category, images, imagesToDelete }) => {
  try {
    if (imagesToDelete) await deleteImages(imagesToDelete);
    const product = await Product.findByPk(id, { include: getProductIncludes(), paranoid: false });
    const productImages = await product.getImages();

    if (images && images.length && typeof images === "object") {
      const imagesInstances = await uploadImages(
        Array.isArray(images) ? images : [images].filter(Boolean)
      );
      productImages.find(image => image.url === defaultImageUrl)
        ? await product.setImages(imagesInstances)
        : await product.addImages(imagesInstances);
    } else if (productImages.length === 0) {
      const imageInstance = await createImageInDataBase(defaultImageUrl);
      await product.addImages(imageInstance);
    }

    if (category) {
      const categoryInstances = await createCategoryController({ name: category });
      await product.setCategory(categoryInstances);
    }
  } catch (error) {
    console.error("Error setting associations:", error.message);
    throw new Error(`Error setting associations: ${error.message}`);
  }
};

module.exports = {
  safeNumber,
  getProductData,
  getProductIncludes,
  addProductAssociations,
  setProductAssociations,
};
