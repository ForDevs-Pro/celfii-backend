const { Product } = require("../db");
const { createView, addView } = require("./view-controller");
const { getProductData, getProductIncludes } = require("../utils/product-util");

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
    const { images, category, ...productInfo } = productData;
    const [product, created] = await Product.findOrCreate({
      where: { name: productInfo.name },
      defaults: productInfo,
    });

    if (!created) throw new Error("This product already exists in the database!");

    await createView(product.id);
    // const imageInstances = await createImages(images);
    // const categoryInstances = await categoryImages(category);
    // await product.addImages(imageInstances);
    // await product.addCategory(categoryInstances);

    const newProduct = await getProductByIdController(product.id);
    return newProduct;
  } catch (error) {
    console.error("Error creating a product", error);
    throw new Error(`Error creating a product: ${error.message}`);
  }
};

const updateProductByIdController = async (productData, id) => {
  try {
    const [affectedRows, updatedProduct] = await Product.update(
      {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
      },
      { where: { id }, returning: true }
    );

    if (!affectedRows) throw new Error("Product not found");

    // if (productData.images) {
    //   const imageInstances = await createImages(productData.images);
    //   await product.setImages(imageInstances);
    // }

    // if (productData.category) {
    //   const categoryInstances = await createImages(productData.category);
    //   await product.setCategory(categoryInstances);
    // }

    return updatedProduct[0];
  } catch (error) {
    console.error("Error creating a product", error);
    throw new Error(`Error creating a product: ${error.message}`);
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
			include: getProductIncludes(),
		})
		if (!product) throw new Error('No deleted product found with the given id')
		await product.restore()
		const restoredProduct = await Product.findOne({
      where: { id },
      include: getProductIncludes(),
    });
    return restoredProduct;
	} catch (error) {
		console.error('Error restoring product', error)
		throw new Error('Error restoring product')
	}
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductByIdController,
  deleteProductByIdController,
  restoreProductByIdController
};
