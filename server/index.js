const express = require("express");
const dotenv = require("dotenv");
const Routes = require("./Routes/userRoutes");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} successfully`);
});
