require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false,
  native: false,
});

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Category, Image, Product, Role, User, View } = sequelize.models;

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Category.hasOne(Product, { foreignKey: "categoryId", as: "product" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Product.hasOne(View, { foreignKey: "productId", as: "view", onDelete: "CASCADE" });
View.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Image, { foreignKey: "productId", as: "images", onDelete: "CASCADE" });
Image.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
  sequelize,
};
