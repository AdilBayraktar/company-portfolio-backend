const express = require("express");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
require("dotenv").config();

// Init App
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(
  // Parse data to json format
  express.json({
    limit: "1000kb",
  })
);
app.use(helmet()); // Security Headers
app.use(hpp()); // Prevent http param pollution

// Use Limit Requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 60 minutes)
  message: "Too many requests sent from this IP, please try again later",
});
app.use("/api/login", limiter);

// Remove NoSql injections
app.use(mongoSanitize());

// Prevent Scripts from requests (XSS) attacks
// app.use(xss());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/services", require("./routes/serviceRoute"));
app.use("/api/tech", require("./routes/technologyRoute"));
app.use("/api/features", require("./routes/featuresRoute"));
app.use("/api/projects", require("./routes/projectRoute"));
app.use("/api/messages", require("./routes/contactRoute"));
app.use("/api/blog", require("./routes/blogRoute"));

// Run Server
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`Server runnung in ${process.env.NODE_ENV} mode on port ${port}`)
);
