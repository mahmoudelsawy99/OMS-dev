const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    company: {
      name: String,
      taxId: String,
      industry: String,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: "Saudi Arabia" },
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      sameAsAddress: { type: Boolean, default: true },
    },
    contactPerson: {
      name: String,
      phone: String,
      email: String,
      position: String,
    },
    customerType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: String,
      enum: ["cash", "net15", "net30", "net60"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    notes: String,
    tags: [String],
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

// Index for search
customerSchema.index({ name: "text", email: "text", "company.name": "text" })

module.exports = mongoose.model("Customer", customerSchema)
