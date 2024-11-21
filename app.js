const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const transacRoutes = require("./src/routes/trasactionRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/transaction", transacRoutes);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
