import express from "express";
// const dotenv = require("dotenv");
import dotenv from "dotenv";

// const Routes = require("./Routes/userRoutes");
import Routes from "./Routes"
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/", Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} successfully`);
});
