const { google } = require('googleapis');
require('dotenv').config();

const getSheetDataController = async () => {
  const props = [
    'name',
    'priceArs',
    'priceUsd',
    'id',
    'code',
    'images',
    'category',
    'stock',
    'createdAt',
    'isDeleted',
  ];
  const client = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = 'Articulos!A:J';
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values.slice(1);
    if (rows.length) {
      return rows.map((row) =>
        row.reduce((acc, item, index) => {
          acc[props[index]] = item;
          return acc;
        }, {})
      );
    } else return [];
  } catch (error) {
    console.error('Error al acceder a Google Sheets API:', error);
    throw new Error(`Error al acceder a Google Sheets API: ${error}`);
  }
};

const getDataSheetByIdController = async (id) => {
  try {
    const products = await getSheetDataController();
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id} from Google Sheets`, error);
    throw new Error(`Error fetching product with id ${id}: ${error.message}`);
  }
};

const createDataSheetController = async (productData) => {
  try {
    const client = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'Articulos!A:I';
    const newRow = [
      productData.name,
      productData.priceArs,
      productData.priceUsd,
      productData.id,
      productData.code,
      productData.images,
      productData.category,
      productData.stock,
      new Date().toISOString(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: { values: [newRow] },
    });

    return { message: 'Product created successfully' };
  } catch (error) {
    console.error('Error creating a product in Google Sheets', error);
    throw new Error('Error creating a product in Google Sheets');
  }
};

const updateDataSheetByIdController = async (productData, id, isDeleted = false) => {
  try {
    const client = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const products = await getSheetDataController();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const rowNumber = productIndex + 2;
    const newRange = `Articulos!A${rowNumber}:J${rowNumber}`;
    const updatedRow = [
      productData.name,
      productData.priceArs,
      productData.priceUsd,
      id,
      productData.code,
      productData.images,
      productData.category,
      productData.stock,
      new Date().toISOString(),
      isDeleted ? 'TRUE' : 'FALSE',
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: newRange,
      valueInputOption: 'RAW',
      resource: { values: [updatedRow] },
    });

    return { message: 'Product updated successfully' };
  } catch (error) {
    console.error('Error updating product in Google Sheets', error);
    throw new Error('Error updating product in Google Sheets');
  }
};

const deleteDataSheetByIdController = async (id) => {
  try {
    const products = await getSheetDataController();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    products[productIndex].isDeleted = true;
    await updateDataSheetByIdController(products[productIndex], id, true);
    return { message: 'Product marked as deleted' };
  } catch (error) {
    console.error('Error deleting product in Google Sheets', error);
    throw new Error('Error deleting product in Google Sheets');
  }
};

module.exports = {
  getSheetDataController,
  getDataSheetByIdController,
  createDataSheetController,
  updateDataSheetByIdController,
  deleteDataSheetByIdController,
};
