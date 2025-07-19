const mongoose = require("mongoose")

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    company: {
      name: {
        type: String,
        required: function () {
          return this.supplierType === "business"
        },
      },
      taxId: {
        type: String,
        required: function () {
          return this.supplierType === "business"
        },
      },
      industry: {
        type: String,
        enum: ["Logistics", "Manufacturing", "Trading", "Services", "Other"],
      },
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: String,
      country: {
        type: String,
        default: "Saudi Arabia",
      },
      postalCode: String,
    },
    supplierType: {
      type: String,
      enum: ["individual", "business"],
      default: "business",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: String,
      default: "Net 30",
    },
    notes: String,
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

// Create text index for search functionality
supplierSchema.index({
  name: "text",
  email: "text",
  "company.name": "text",
})

// Pre-save middleware to handle business vs individual logic
supplierSchema.pre("save", function (next) {
  if (this.supplierType === "individual") {
    // Remove company fields for individual suppliers
    this.company = undefined
  }
  next()
})

module.exports = mongoose.model("Supplier", supplierSchema) 