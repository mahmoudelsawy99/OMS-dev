const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["air_freight", "sea_freight", "land_transport", "express_delivery", "warehousing"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_transit", "delivered", "cancelled", "on_hold"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    origin: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      contactPerson: {
        name: String,
        phone: String,
      },
    },
    destination: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      contactPerson: {
        name: String,
        phone: String,
      },
    },
    cargo: {
      description: { type: String, required: true },
      weight: { type: Number, required: true }, // in kg
      dimensions: {
        length: Number, // in cm
        width: Number,
        height: Number,
      },
      value: Number, // in SAR
      quantity: { type: Number, default: 1 },
      packageType: {
        type: String,
        enum: ["box", "pallet", "container", "envelope", "other"],
        default: "box",
      },
      specialInstructions: String,
      hazardous: { type: Boolean, default: false },
    },
    pricing: {
      basePrice: { type: Number, required: true },
      additionalCharges: [
        {
          description: String,
          amount: Number,
        },
      ],
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    timeline: {
      estimatedPickup: Date,
      actualPickup: Date,
      estimatedDelivery: Date,
      actualDelivery: Date,
      transitTime: Number, // in hours
    },
    documents: [
      {
        name: String,
        type: {
          type: String,
          enum: ["invoice", "packing_list", "customs_declaration", "insurance", "other"],
        },
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    insurance: {
      required: { type: Boolean, default: false },
      provider: String,
      policyNumber: String,
      coverage: Number,
      premium: Number,
    },
    customsInfo: {
      declarationNumber: String,
      hsCode: String,
      dutyAmount: Number,
      clearanceStatus: {
        type: String,
        enum: ["pending", "cleared", "held", "rejected"],
        default: "pending",
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    tracking: {
      trackingNumber: String,
      currentLocation: {
        address: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
        timestamp: Date,
      },
      updates: [
        {
          status: String,
          location: String,
          timestamp: { type: Date, default: Date.now },
          notes: String,
          updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },
    notes: String,
    internalNotes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments()
    this.orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`
  }
  next()
})

// Index for search and performance
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ customer: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ "tracking.trackingNumber": 1 })

module.exports = mongoose.model("Order", orderSchema)
