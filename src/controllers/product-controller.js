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
    const { costArs, costUsd, priceArs, priceUsd, priceWholesale } = productData;
    const dollar = await Dollar.findOne({ order: [["date", "DESC"]] });
    if (!dollar) throw new Error("Dollar rate not found");
    await setProductAssociations({ id, ...productData });
    const finalCostUsd = costUsd == 0 && Number(costArs) ? costArs / dollar.rate : Number(costUsd);
    const finalPriceArs = priceArs == 0 && finalCostUsd ? finalCostUsd * 2 * dollar.rate : priceArs;
    const finalPriceUsd = priceUsd == 0 && finalCostUsd ? finalCostUsd * 2 : priceUsd;
    const finalPriceWholesale =
      priceWholesale == 0 && finalCostUsd ? finalCostUsd * 1.5 * dollar.rate : priceWholesale;
    const [affectedRows, updatedProduct] = await Product.update(
      {
        costArs: Number(costArs) || 0,
        costUsd: finalCostUsd || 0,
        priceArs: finalPriceArs || 0,
        priceUsd: finalPriceUsd || 0,
        priceWholesale: finalPriceWholesale || 0,
        name: productData.name,
        stock: productData.stock,
        imei: productData.imei,
        code: productData.code,
        description: productData.description,
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
    console.error(`Error updating product with id: ${id}`, error);
    throw new Error(`Error updating product with id: ${id}: ${error.message}`);
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
