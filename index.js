const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const PORT = process.env.PORT || 3001;

const createSeeders = require("./src/seeder.js");

conn
  .sync({ force: true })
  .then(() => {
    server.listen(PORT, () => {
      createSeeders();
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
