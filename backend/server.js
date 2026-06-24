const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/error");

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use(errorMiddleware);

app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
