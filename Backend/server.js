require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database.config");

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`✅ Test URL → http://localhost:${PORT}`);
  });
});
