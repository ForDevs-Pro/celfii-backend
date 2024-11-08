const { Category, Role, Product, View } = require("./db");
const { getSheetDataService } = require("./services/api-service");
const { createRoleController } = require("./controllers/role-controller");
const { createUserController } = require("./controllers/user-controller");
const { createProductController } = require("./controllers/product-controller");
const { createCategoryController } = require("./controllers/category-controller");
const { createDollarEntryController } = require("./controllers/dollar-controller");

const normalizeNumber = (value) =>
  typeof value === "string"
    ? parseFloat(value.replace(/[^0-9,.-]/g, "").replace(",", ".")) || 0
    : value || 0;

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

const createDollarEntry = async (rate) => {
  try {
    await createDollarEntryController(rate);
    console.log(`Tasa de cambio del dólar creada con valor: ${rate}`);
  } catch (error) {
    console.error("Error al crear la tasa de cambio del dólar:", error.message);
  }
};

const createCategories = async (categories) => {
  for (const { name } of categories) {
    try {
      await createCategoryController({ name });
    } catch (error) {
      console.error(`Error al crear la categoría ${name}: ${error.message}`);
    }
  }
};

const createProducts = async (allProducts) => {
  for (const product of allProducts) {
    if (!product.idEquipo && !product.id) continue;

    const categoryName = product.IMEI ? "Equipos" : product.category || "Equipos";
    const [category] = await Category.findOrCreate({ where: { name: categoryName } });

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
      costUsd: normalizeNumber(product.costUsd),
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
      console.error(`Error al crear el producto ${productData.name}: ${error.message}`);
    }
  }
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
    console.log("Vistas actualizadas con éxito.");
  } catch (error) {
    console.error("Error al actualizar las vistas:", error.message);
  }
};

const createUser = async () => {
  try {
    const roleMaster = await Role.findOne({ where: { name: "Master" } });
    if (!roleMaster) throw new Error("Rol Master no encontrado.");

    const newUser = await createUserController({
      username: "celfii",
      email: "celfii@celfii.com",
      password: "celfii123",
      roleId: roleMaster.id,
    });
    console.log(`Usuario ${newUser.username} creado correctamente.`);
  } catch (error) {
    console.error(`Error al crear el usuario Master: ${error.message}`);
  }
};

const createSeeders = async () => {
  try {
    await createRoles(["Master", "Admin"]);
    await createUser();

    const { articulos, stockEquipos } = await getSheetDataService();
    const allProducts = [...articulos, ...stockEquipos];
    const categories = Array.from(
      new Set(allProducts.map((p) => ({ name: p.category?.trim() || "Equipos" })))
    );

    await createDollarEntry(1300);
    await createCategories(categories);
    await createProducts(allProducts);
    await updateViewCounters();

    console.log("Seeders cargados exitosamente.");
  } catch (error) {
    console.error("Error al cargar seeders:", error.message);
  }
};

module.exports = createSeeders;
