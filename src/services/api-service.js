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
  const propsSheet1 = [
    "name",
    "priceArs",
    "priceUsd",
    "id",
    "code",
    "images",
    "category",
    "stock",
    "createdAt",
    "isDeleted",
  ];

  const propsSheet2 = ["id", "imei", "name", "priceArs", "priceUsd"];
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const ranges = ["Articulos!A:J", "Stock equipos!A:E"];

  try {
    const sheets = sheetsClient();
    const responses = await Promise.all(
      ranges.map((range) => sheets.spreadsheets.values.get({ spreadsheetId, range }))
    );

    const processRows = (rows, props) =>
      rows.slice(1).map((row) =>
        row.reduce((acc, item, index) => {
          acc[props[index]] = item;
          return acc;
        }, {})
      );

    const processedSheet1 = processRows(responses[0].data.values, propsSheet1);
    const processedSheet2 = processRows(responses[1].data.values, propsSheet2);

    return [...processedSheet1, ...processedSheet2];
  } catch (error) {
    console.error("Error accessing Google Sheets API:", error);
    throw new Error(`Error accessing Google Sheets API: ${error.message}`);
  }
};

const getDataSheetByIdService = async (id) => {
  try {
    const products = await getSheetDataService();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error(`Error fetching product with id ${id}: ${error.message}`);
  }
};

const createDataSheetService = async (productData) => {
  try {
    const sheets = sheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = "Articulos!A:I";
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
      valueInputOption: "RAW",
      resource: { values: [newRow] },
    });

    return { message: "Product created successfully" };
  } catch (error) {
    console.error("Error creating product in Google Sheets:", error);
    throw new Error("Error creating product in Google Sheets");
  }
};

const updateDataSheetByIdService = async (productData, id, isDeleted = false) => {
  try {
    const sheets = sheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const products = await getSheetDataService();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) throw new Error("Product not found");

    const rowNumber = productIndex + 2;
    const range = `Articulos!A${rowNumber}:J${rowNumber}`;
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
      isDeleted ? "TRUE" : "FALSE",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values: [updatedRow] },
    });

    return { message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product in Google Sheets:", error);
    throw new Error("Error updating product in Google Sheets");
  }
};

const deleteDataSheetByIdService = async (id) => {
  try {
    const products = await getSheetDataService();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) throw new Error("Product not found");

    const updatedProduct = { ...products[productIndex], isDeleted: "TRUE" };
    await updateDataSheetByIdService(updatedProduct, id, true);

    return { message: "Product marked as deleted" };
  } catch (error) {
    console.error("Error deleting product in Google Sheets:", error);
    throw new Error("Error deleting product in Google Sheets");
  }
};

module.exports = {
  getSheetDataService,
  getDataSheetByIdService,
  createDataSheetService,
  updateDataSheetByIdService,
  deleteDataSheetByIdService,
};
