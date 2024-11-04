const { createProductController } = require("./controllers/product-controller");
const { createRoleController } = require("./controllers/role-controller");
const { getSheetDataService } = require("./services/api-service");
const { createCategoryController } = require("./controllers/category-controller");
const { createUserController } = require("./controllers/user-controller");
const { Category, Role, Product, View } = require("./db");

const normalizeNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(
      value
        .replace(/[^0-9,.-]/g, "")
        .trim()
        .replace(/\./g, "")
        .replace(",", ".")
    );
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
  console.log("Roles Admin y Master creados correctamente.");
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
  console.log("Categorías creadas correctamente.");
};

const findOrCreateCategory = async (categoryName) => {
  let category = await Category.findOne({ where: { name: categoryName } });
  return category || createCategoryController(categoryName);
};

const createProducts = async (allProducts) => {
  for (const product of allProducts) {
    if (!product.idEquipo && !product.id) continue;

    const categoryName = product.IMEI ? "Equipos" : product.category || "Otros";
    const category = await findOrCreateCategory(categoryName);

    const images = product.images?.includes("https")
      ? [product.images]
      : product.images
      ? [
          `https://www.appsheet.com/template/gettablefileurl?appName=NewApp-645565216&appId=79fbe012-f78c-4246-833e-28e13ab4b6f4&tableName=Articulos&fileName=${encodeURIComponent(
            product.images
          )}`,
        ]
      : [];

    const productData = {
      name: product.model || product.name || "Producto por defecto",
      description: product.description || "Sin descripción disponible",
      costUsd: normalizeNumber(product.costUsd) || 0,
      stock: parseInt(product.stock, 10) || 0,
      code: product.code || `CODE-${Math.floor(Math.random() * 10000)}`,
      imei: product.IMEI?.replace(/\s/g, ""),
      isDeleted: product.isDeleted === "TRUE",
      categoryId: category.id,
      images,
    };

    try {
      await createProductController(productData);
    } catch (error) {
      console.error(`Error al crear el producto ${productData.name}:`, error);
    }
  }
  console.log("Productos cargados con exito");
};

const updateViewCounters = async () => {
  try {
    const products = await Product.findAll();
    for (const product of products) {
      const view = await View.findOne({ where: { productId: product.id } });
      if (view) {
        view.counter = Math.floor(Math.random() * 1000);
        await view.save();
      }
    }
    console.log("Seeder de actualización de vistas ejecutado con éxito");
  } catch (error) {
    console.error("Error al ejecutar el seeder de actualización de vistas:", error.message);
  }
};

const createUser = async () => {
  const masterUserData = {
    username: "celfii",
    email: "celfii@celfii.com",
    password: "celfii123",
  };

  try {
    const roleMaster = await Role.findOne({ where: { name: "Master" } });
    if (!roleMaster) {
      console.error("Rol Master no encontrado para crear el usuario.");
      return;
    }
    const newUser = await createUserController({ ...masterUserData, roleId: roleMaster.id });
    console.log(`Usuario Master ${masterUserData.username} creado correctamente.`);
    console.log(`Rol ${roleMaster.name} asignado al usuario ${newUser.username}.`);
  } catch (error) {
    console.error(`Error al crear el usuario Master: ${error.message}`);
  }
};

const createSeeders = async () => {
  try {
    const roles = ["Master", "Admin"];
    await createRoles(roles);
    await createUser();

    const { articulos, stockEquipos } = await getSheetDataService();
    const allProducts = [...articulos, ...stockEquipos];

    const categories = Array.from(
      new Set(allProducts.map((p) => p.category?.trim()).filter(Boolean))
    );
    if (!categories.includes("Equipos")) categories.push("Equipos");

    await createDollarEntry(1300)
    await createCategories(categories);
    await createProducts(allProducts);
    await updateViewCounters();

    console.log("Seeders cargados exitosamente");
  } catch (error) {
    console.error("Error al cargar seeders:", error);
  }
};

module.exports = createSeeders;
