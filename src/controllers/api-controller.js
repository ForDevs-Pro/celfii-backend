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
  ];
  const client = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = 'Articulos!A:I';
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

module.exports = { getSheetDataController };
