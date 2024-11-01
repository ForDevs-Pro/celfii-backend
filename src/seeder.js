<<<<<<< Updated upstream
const { createProductController } = require('./controllers/product-controller');
const { createRoleController } = require('./controllers/roleController');
const { getSheetDataService } = require('./services/api-service');
const { createCategoryController } = require('./controllers/category-controller');
const { createUserController } = require('./controllers/userController');
const { Category, Role, Product, View } = require('./db');
=======
const { getSheetDataService } = require("./services/api-service");
const { createUserController } = require("./controllers/user-controller");
const { createRoleController } = require("./controllers/role-controller");
const { createProductController } = require("./controllers/product-controller");
const { createCategoryController } = require("./controllers/category-controller");
const { createDollarEntryController } = require("./controllers/dollar-controller");
const { Category, Role, Product, View } = require("./db");
>>>>>>> Stashed changes

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
    } catch (error) {
      console.error(`Error al crear el rol ${roleName}: ${error.message}`);
    }
  }
  console.log(`Roles Admin y Master creado correctamente.`);
};

const createDollarEntry = async (rate) => {
  try {
    await createDollarEntryController(rate)
    console.log(`Tasa de cambio del dólar creada con valor: ${rate}`);
  } catch (error) {
    console.error("Error al crear o actualizar la tasa de cambio del dólar:", error.message);
  }
};

const createCategories = async (categories) => {
  for (const categoryName of categories) {
    try {
      await createCategoryController(categoryName);
    } catch (error) {
      console.error(`Error al crear la categoría ${categoryName}: ${error.message}`);
    }
  }
  console.log(`Categorías creadas correctamente.`);
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
      imei: product.imei ? product.imei.replace(/\s/g, "") : null,
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

const updateViewCounters = async () => {
  try {
    const products = await Product.findAll();

    for (const product of products) {
      const view = await View.findOne({ where: { productId: product.id } });

      if (view) {
        const randomViews = Math.floor(Math.random() * 1000);
        view.counter = randomViews;
        await view.save();
      }
    }
    console.log('Seeder de actualización de vistas ejecutado con éxito');
  } catch (error) {
    console.error('Error al ejecutar el seeder de actualización de vistas:', error.message);
  }
};

const createUser = async () => {
  const masterUserData = {
    username: 'celfii',
    email: 'celfii@celfii.com',
    password: 'celfii123',
  };

  try {
    const roleMaster = await Role.findOne({ where: { name: 'Master' } });
    if (!roleMaster) {
      console.error('Rol Master no encontrado para crear el usuario.');
      return;
    }
    const newUser = await createUserController({
      ...masterUserData,
      roleId: roleMaster.id,
    });
    console.log(`Usuario Master ${masterUserData.username} creado correctamente.`);
    console.log(`Rol ${roleMaster.name} asignado al usuario ${newUser.username}.`);
  } catch (error) {
    console.error(`Error al crear el usuario Master: ${error.message}`);
  }
};

const createSeeders = async () => {
  try {
    const roles = ['Master', 'Admin'];

    await createRoles(roles);
    await createUser();

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

    await createDollarEntry(1300)
    await createCategories(categories);
    await createProducts(sheetData);
    await updateViewCounters();

    console.log('Seeders cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar seeders:', error);
  }
};

module.exports = createSeeders;
