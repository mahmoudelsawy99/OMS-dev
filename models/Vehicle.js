const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["truck", "van", "motorcycle", "ship", "plane"],
      required: true,
    },
    model: {
      brand: String,
      model: String,
      year: Number,
    },
    capacity: {
      weight: Number, // in kg
      volume: Number, // in cubic meters
    },
    driver: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      licenseNumber: String,
      licenseExpiry: Date,
    },
    status: {
      type: String,
      enum: ["available", "in_transit", "maintenance", "out_of_service"],
      default: "available",
    },
    currentLocation: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      lastUpdated: { type: Date, default: Date.now },
    },
    maintenance: {
      lastService: Date,
      nextService: Date,
      mileage: Number,
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    documents: [
      {
        type: String,
        url: String,
        expiryDate: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Vehicle", vehicleSchema)
