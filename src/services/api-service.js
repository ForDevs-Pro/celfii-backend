const { google } = require('googleapis');
require('dotenv').config();

const getSheetDataService = async () => {
  const propsSheet1 = [
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

  const propsSheet2 = ['id', 'imei', 'name', 'priceArs', 'priceUsd'];

  const client = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const ranges = ['Articulos!A:J', 'Stock equipos!A:E'];

  try {
    const responses = await Promise.all(
      ranges.map((range) =>
        sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        })
      )
    );

    const rowsSheet1 = responses[0].data.values.slice(1);
    const processedSheet1 = rowsSheet1.map((row) =>
      row.reduce((acc, item, index) => {
        acc[propsSheet1[index]] = item;
        return acc;
      }, {})
    );

    const rowsSheet2 = responses[1].data.values.slice(1);
    const processedSheet2 = rowsSheet2.map((row) =>
      row.reduce((acc, item, index) => {
        acc[propsSheet2[index]] = item;
        return acc;
      }, {})
    );
    const allRows = [...processedSheet1, ...processedSheet2];

    return allRows;
  } catch (error) {
    console.error('Error al acceder a Google Sheets API:', error);
    throw new Error(`Error al acceder a Google Sheets API: ${error}`);
  }
};

const getDataSheetByIdService = async (id) => {
  try {
    const products = await getSheetDataService();
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

const createDataSheetService = async (productData) => {
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

const updateDataSheetByIdService = async (productData, id, isDeleted = false) => {
  try {
    const client = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const products = await getSheetDataService();
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

const deleteDataSheetByIdService = async (id) => {
  try {
    const products = await getSheetDataService();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    products[productIndex].isDeleted = true;
    await updateDataSheetByIdService(products[productIndex], id, true);
    return { message: 'Product marked as deleted' };
  } catch (error) {
    console.error('Error deleting product in Google Sheets', error);
    throw new Error('Error deleting product in Google Sheets');
  }
};

module.exports = {
  getSheetDataService,
  getDataSheetByIdService,
  createDataSheetService,
  updateDataSheetByIdService,
  deleteDataSheetByIdService,
};
