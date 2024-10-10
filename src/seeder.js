const { createProductController } = require('./controllers/product-controller');
const { getSheetDataService } = require('./services/api-service');

const normalizeNumber = (value) => {
  if (typeof value === 'string') {
    const cleanedValue = value.replace(/[^0-9,.-]/g, '').trim();
    const parsedValue = parseFloat(cleanedValue.replace(/\./g, '').replace(',', '.'));
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  return value || 0;
};

const createSeeders = async () => {
  try {
    const sheetData = await getSheetDataService();

    for (let i = 0; i < sheetData.length; i++) {
      const product = sheetData[i];

      if (!product.id) continue;

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
      };

      try {
        await createProductController(productData);
      } catch (error) {
        console.error(`Error al crear el producto ${productData.name}:`, error.message);
      }
    }

    console.log('Seeders cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar seeders:', error);
  }
};

module.exports = createSeeders;
