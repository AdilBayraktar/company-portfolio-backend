const express = require("express");
const connectDB = require("./config/connectDB");
const cors = require("cors");
require("dotenv").config();

// Init App
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(express.json()); // Parse data to json format

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/services", require("./routes/serviceRoute"));
app.use("/api/tech", require("./routes/technologyRoute"));
app.use("/api/features", require("./routes/featuresRoute"));
app.use("/api/projects", require("./routes/projectRoute"));
app.use("/api/messages", require("./routes/contactRoute"));

// Run Server
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`Server runnung in ${process.env.NODE_ENV} mode on port ${port}`)
);
