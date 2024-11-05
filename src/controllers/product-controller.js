const { Product, Dollar } = require("../db");
const { addView } = require("./view-controller");
const {
  getProductData,
  getProductIncludes,
  setProductAssociations,
  addProductAssociations,
} = require("../utils/product-util");

const getAllProductsController = async (queries) => {
  try {
    const productData = getProductData(queries);
    const products = await Product.findAndCountAll(productData);

    return {
      rows: products.rows.map((product) => {
        const data = product.dataValues;
        return data;
      }),
      count: products.count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

const getProductByIdController = async (id) => {
  try {
    const product = await Product.findByPk(id, { include: getProductIncludes(), paranoid: false });
    await addView(product.id);
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}`, error);
    throw new Error(`Error fetching product with id ${id}: ${error.message}`);
  }
};

const createProductController = async (productData) => {
  const dollar = await Dollar.findOne();
  try {
    const defaults = {
      name: productData.name,
      description: productData.description,
      costArs: productData.costArs,
      costUsd: productData.costUsd || productData.costArs / dollar.rate,
      priceUsd: productData.priceUsd || productData.costUsd * 2,
      priceArs: productData.priceArs || productData.costUsd * 2 * dollar.rate,
      priceWholesale: productData.priceWholesale || productData.costUsd * 1.5 * dollar.rate,
      stock: productData.stock,
      code: productData.code,
      imei: productData.imei,
      deletedAt: productData.isDeleted ? new Date() : null,
    };

    if (productData.categoryId) defaults.categoryId = productData.categoryId;

    const product = await Product.create(defaults);

    await addProductAssociations({ id: product.id, ...productData });

    return await Product.findByPk(product.id, { include: getProductIncludes() });
  } catch (error) {
    console.error("Error creating a product", error);
    throw new Error(`Error creating a product: ${error.message}`);
  }
};

const updateProductByIdController = async (productData, id) => {
  try {
    console.log(productData);
    const dollar = await Dollar.findOne({ order: [["date", "DESC"]] });
    if (!dollar) throw new Error("Dollar rate not found");
    await setProductAssociations({ id, ...productData });
    const [affectedRows, updatedProduct] = await Product.update(
      {
        name: productData.name && productData.name,
        description: productData.description && productData.description,
        costArs: productData.costUsd && productData.costArs,
        costUsd: productData.costUsd && productData.costArs / dollar.rate,
        priceArs: productData.costUsd && productData.costUsd * 2 * dollar.rate,
        priceUsd: productData.costUsd && productData.costUsd * 2,
        priceWholesale: productData.costUsd && productData.costUsd * 1.5 * dollar.rate,
        stock: productData.stock && productData.stock,
        code: productData.code && productData.code,
        imei: productData.imei && productData.imei,
      },
      {
        where: { id },
        paranoid: false,
        include: getProductIncludes(),
      }
    );
    if (!affectedRows) throw new Error("No se pudo actualizar el producto");
    return updatedProduct;
  } catch (error) {
    console.error("Error actualizando el producto", error);
    throw new Error(`Error actualizando el producto: ${error.message}`);
  }
};

const deleteProductByIdController = async (id) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    await Product.destroy({ where: { id } });
    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting products:", error);
    throw new Error(`Error deleting product: ${error.message}`);
  }
};

const restoreProductByIdController = async (id) => {
  try {
    const product = await Product.findOne({
      where: { id },
      paranoid: false,
    });
    if (!product) throw new Error("No deleted product found with the given id");
    await product.restore();
    return product;
  } catch (error) {
    console.error("Error restoring product", error);
    throw new Error("Error restoring product");
  }
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductByIdController,
  deleteProductByIdController,
  restoreProductByIdController,
};
