const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const app = express()

// Security middleware
app.use(helmet())

// Rate limiting (increase for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased for dev
})
app.use("/api/", limiter)

// CORS configuration (allow localhost:3000 for dev)
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static files
app.use("/uploads", express.static("uploads"))

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
app.use("/api/auth", require("../routes/auth"))
app.use("/api/users", require("../routes/users"))
app.use("/api/customers", require("../routes/customers"))
app.use("/api/suppliers", require("../routes/suppliers"))
app.use("/api/orders", require("../routes/orders"))
app.use("/api/shipments", require("../routes/shipments"))
app.use("/api/vehicles", require("../routes/vehicles"))
app.use("/api/invoices", require("../routes/invoices"))
app.use("/api/reports", require("../routes/reports"))
app.use("/api/notifications", require("../routes/notifications"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = 5002
app.listen(PORT, () => {
  console.log(`🚀 Local Backend Server running on port ${PORT}`)
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🌐 Environment: development`)
})

module.exports = app 