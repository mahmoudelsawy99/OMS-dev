const mongoose = require("mongoose")

const shipmentSchema = new mongoose.Schema(
  {
    shipmentNumber: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    route: [
      {
        location: {
          address: String,
          coordinates: {
            lat: Number,
            lng: Number,
          },
        },
        estimatedTime: Date,
        actualTime: Date,
        status: {
          type: String,
          enum: ["pending", "reached", "departed"],
          default: "pending",
        },
      },
    ],
    currentStatus: {
      type: String,
      enum: ["preparing", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"],
      default: "preparing",
    },
    realTimeTracking: {
      currentLocation: {
        coordinates: {
          lat: Number,
          lng: Number,
        },
        address: String,
        timestamp: Date,
      },
      speed: Number, // km/h
      direction: Number, // degrees
      batteryLevel: Number,
      signal: String,
    },
    statistics: {
      totalDistance: Number, // km
      distanceTraveled: Number, // km
      averageSpeed: Number, // km/h
      maxSpeed: Number, // km/h
      fuelConsumption: Number, // liters
      estimatedArrival: Date,
    },
    events: [
      {
        type: {
          type: String,
          enum: ["pickup", "delivery", "delay", "exception", "location_update"],
          required: true,
        },
        description: String,
        location: {
          address: String,
          coordinates: {
            lat: Number,
            lng: Number,
          },
        },
        timestamp: { type: Date, default: Date.now },
        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    proof: {
      delivery: {
        signature: String, // base64 image
        photo: String, // URL
        recipientName: String,
        deliveredAt: Date,
      },
      pickup: {
        photo: String,
        pickedUpAt: Date,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Generate shipment number
shipmentSchema.pre("save", async function (next) {
  if (!this.shipmentNumber) {
    const count = await mongoose.model("Shipment").countDocuments()
    this.shipmentNumber = `SHP-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Shipment", shipmentSchema)
