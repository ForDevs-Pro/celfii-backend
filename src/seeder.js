const { createProductController } = require('./controllers/product-controller');
const { createRoleController } = require('./controllers/roleController');
const { getSheetDataService } = require('./services/api-service');
const { createCategoryController } = require('./controllers/category-controller');
const { Category } = require('./db');

const normalizeNumber = (value) => {
  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[^0-9,.-]/g, '').trim();
    const parsedValue = parseFloat(cleanedValue.replace(/\./g, '').replace(',', '.'));
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  return value || 0;
};

const createRoles = async (roles) => {
  for (const roleName of roles) {
    try {
      await createRoleController(roleName);
      console.log(`Rol ${roleName} creado correctamente.`);
    } catch (error) {
      console.error(`Error al crear el rol ${roleName}: ${error.message}`);
    }
  }
};

const createCategories = async (categories) => {
  for (const categoryName of categories) {
    try {
      await createCategoryController(categoryName);
      console.log(`Categoría ${categoryName} creada correctamente.`);
    } catch (error) {
      console.error(`Error al crear la categoría ${categoryName}: ${error.message}`);
    }
  }
};

const findOrCreateCategory = async (categoryName) => {
  let category = await Category.findOne({ where: { name: categoryName } });
  if (!category) {
    category = await createCategoryController(categoryName);
  }
  return category;
};

const createProducts = async (sheetData) => {
  for (const product of sheetData) {
    if (!product.id) continue;

    const categoryName = product.imei ? 'Equipos' : product.category || 'Otros';
    const category = await findOrCreateCategory(categoryName);

    const productData = {
      id: product.id,
      name: product.name || 'Producto por defecto',
      description: product.description || 'Sin descripción disponible',
      priceArs: normalizeNumber(product.priceArs) || 1,
      priceUsd: normalizeNumber(product.priceUsd) || 1,
      stock: parseInt(product.stock, 10) || 0,
      code: product.code || `CODE-${Math.floor(Math.random() * 10000)}`,
      imei: product.imei || null,
      isDeleted: product.isDeleted === 'TRUE',
      categoryId: category.id,
    };

    try {
      await createProductController(productData);
    } catch (error) {
      console.error(`Error al crear el producto ${productData.name}:`, error.message);
    }
  }
};

const createSeeders = async () => {
  try {
    const roles = ['Master', 'Admin'];
    await createRoles(roles);

    const sheetData = await getSheetDataService();

    const categories = [
      ...new Set(
        sheetData
          .map((product) => product.category)
          .filter(Boolean)
          .map((category) => category.trim())
      ),
    ];

    if (!categories.includes('Equipos')) {
      categories.push('Equipos');
    }

    await createCategories(categories);
    await createProducts(sheetData);

    console.log('Seeders cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar seeders:', error);
  }
};

module.exports = createSeeders;
