const { Product } = require('./db');
const { getSheetDataController } = require('./services/api-service');

const normalizeNumber = (value) => {
  if (typeof value === 'string') {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  }
  return value;
};

const createSeeders = async () => {
  try {
    const sheetData = await getSheetDataController();

    for (let i = 0; i < sheetData.length; i++) {
      const product = sheetData[i];
      if (!product.id || !product.name || !product.priceArs || !product.priceUsd) {
        console.error(`Faltan datos obligatorios en el producto ${i + 1}:`, product);
        continue;
      }
      await Product.create({
        id: product.id,
        name: product.name,
        description: product.description || 'Sin descripción disponible',
        priceArs: normalizeNumber(product.priceArs),
        priceUsd: normalizeNumber(product.priceUsd),
        stock: product.stock || 0,
        code: product.code || null,
        imei: product.imei || null,
      });
    }
    console.log('Seeders cargados exitosamente en el orden correcto');
  } catch (error) {
    console.error('Error al cargar seeders:', error);
  }
};

module.exports = createSeeders;
