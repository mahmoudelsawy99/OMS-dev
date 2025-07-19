const express = require("express")
const { body, validationResult } = require("express-validator")
const Order = require("../models/Order")
const Customer = require("../models/Customer")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status
    }

    // Filter by service type
    if (req.query.serviceType) {
      filter.serviceType = req.query.serviceType
    }

    // Filter by customer (for client role)
    if (req.user.role === "client") {
      const customer = await Customer.findOne({ email: req.user.email })
      if (customer) {
        filter.customer = customer._id
      }
    }

    const orders = await Order.find(filter)
      .populate("customer", "name email company")
      .populate("assignedTo", "name email")
      .populate("vehicle", "plateNumber type driver")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments(filter)

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("assignedTo", "name email")
      .populate("vehicle")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if client can access this order
    if (req.user.role === "client") {
      const customer = await Customer.findOne({ email: req.user.email })
      if (!customer || !order.customer._id.equals(customer._id)) {
        return res.status(403).json({ message: "Access denied" })
      }
    }

    res.json({ success: true, data: order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  "/",
  [
    auth,
    body("customer").isMongoId().withMessage("Valid customer ID is required"),
    body("serviceType")
      .isIn(["air_freight", "sea_freight", "land_transport", "express_delivery", "warehousing"])
      .withMessage("Valid service type is required"),
    body("origin.address").notEmpty().withMessage("Origin address is required"),
    body("destination.address").notEmpty().withMessage("Destination address is required"),
    body("cargo.description").notEmpty().withMessage("Cargo description is required"),
    body("cargo.weight").isNumeric().withMessage("Cargo weight must be a number"),
    body("pricing.basePrice").isNumeric().withMessage("Base price must be a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Calculate total amount
      const { basePrice, additionalCharges = [], discount = 0, tax = 0 } = req.body.pricing
      const additionalTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0)
      const totalAmount = basePrice + additionalTotal - discount + tax

      const order = new Order({
        ...req.body,
        pricing: {
          ...req.body.pricing,
          totalAmount,
        },
        createdBy: req.user.id,
      })

      await order.save()
      await order.populate("customer", "name email company")

      res.status(201).json({ success: true, data: order })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private
router.put("/:id", [auth, authorize("GENERAL_MANAGER", "admin", "employee")], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Recalculate total if pricing is updated
    if (req.body.pricing) {
      const { basePrice, additionalCharges = [], discount = 0, tax = 0 } = req.body.pricing
      const additionalTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0)
      req.body.pricing.totalAmount = basePrice + additionalTotal - discount + tax
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("customer", "name email company")

    res.json({ success: true, data: updatedOrder })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private (Admin only)
router.delete("/:id", [auth, authorize("GENERAL_MANAGER", "admin",)], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Order deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put("/:id/status", [auth, authorize("GENERAL_MANAGER", "admin", "employee")], async (req, res) => {
  try {
    const { status, notes } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status
    if (notes) {
      order.tracking.updates.push({
        status,
        location: order.tracking.currentLocation?.address || "Unknown",
        notes,
        updatedBy: req.user.id,
      })
    }

    await order.save()
    res.json({ success: true, data: order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
