const { Product } = require("../db");
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
    return products.rows.map((product) => product.dataValues);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

const getProductByIdController = async (id) => {
  try {
    const product = await Product.findByPk(id, { include: getProductIncludes() });
    await addView(product.id);
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}`, error);
    throw new Error(`Error fetching product with id ${id}: ${error.message}`);
  }
};

const createProductController = async (productData) => {
  try {
    const [product, created] = await Product.findOrCreate({
      where: { id: productData.id },
      defaults: {
        name: productData.name,
        description: productData.description,
        priceArs: productData.priceArs,
        priceUsd: productData.priceUsd,
        stock: productData.stock,
        code: productData.code,
        imei: productData.imei,
      },
    });

    if (!created) throw new Error("This product already exists in the database!");
    
    await addProductAssociations(productData);

    return await Product.findByPk(product.id, { include: getProductIncludes() });
  } catch (error) {
    console.error("Error creating a product", error);
    throw new Error(`Error creating a product: ${error.message}`);
  }
};

const updateProductByIdController = async (productData, id) => {
  try {
    await setProductAssociations(productData);
    const [affectedRows, updatedProduct] = await Product.update(
      {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        priceArs: productData.priceArs,
        priceUsd: productData.priceUsd,
        stock: productData.stock,
        code: productData.code,
      },
      {
        where: { id },
        returning: true,
        include: getProductIncludes(),
      }
    );
    console.log(affectedRows, updatedProduct);

    if (!affectedRows) throw new Error("Product not found");

    return updatedProduct[0];
  } catch (error) {
    console.error("Error updating a product", error);
    throw new Error(`Error updating a product: ${error.message}`);
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
