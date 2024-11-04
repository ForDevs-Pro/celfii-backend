const { google } = require("googleapis");
require("dotenv").config();

const authClient = () => {
  return new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
};

const sheetsClient = () => {
  const client = authClient();
  return google.sheets({ version: "v4", auth: client });
};

const getSheetDataService = async () => {
  const propsSheetUpdated = [
    "name",
    "priceUsd",
    "priceArs",
    "priceWholesale",
    "id",
    "code",
    "images",
    "category",
    "stock",
    "createdAt",
    "costUsd",
    "costArs",
    "description",
  ];

  const propsSheet2 = ["id", "imei", "name", "priceUsd", "priceArs", "images"];
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const ranges = ["Articulos!A:M", "Stock equipos!A:F"];

  try {
    const sheets = sheetsClient();
    const [articulosResponse, stockEquiposResponse] = await Promise.all(
      ranges.map((range) => sheets.spreadsheets.values.get({ spreadsheetId, range }))
    );

    const processRows = (rows, props) =>
      rows
        .slice(1)
        .map((row) =>
          row.reduce((acc, item, index) => {
            acc[props[index]] = item || null;
            return acc;
          }, {})
        )
        .filter((row) => row[props[0]]);

    const articulos = processRows(articulosResponse.data.values, propsSheetUpdated) || [];
    const stockEquipos = processRows(stockEquiposResponse.data.values, propsSheet2) || [];

    return { articulos, stockEquipos };
  } catch (error) {
    console.error("Error accessing Google Sheets API:", error);
    throw new Error(`Error accessing Google Sheets API: ${error.message}`);
  }
};

module.exports = {
  getSheetDataService,
};
