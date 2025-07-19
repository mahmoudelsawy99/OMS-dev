const express = require("express")
const { body, validationResult } = require("express-validator")
const Customer = require("../models/Customer")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private (Admin/Employee only)
router.get("/", [auth, authorize("GENERAL_MANAGER", "admin", "employee")], async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search }
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status
    }

    // Filter by customer type
    if (req.query.customerType) {
      filter.customerType = req.query.customerType
    }

    const customers = await Customer.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Customer.countDocuments(filter)

    res.json({
      success: true,
      data: customers,
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

// @route   GET /api/customers/:id
// @desc    Get single customer
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("createdBy", "name email")

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    res.json({ success: true, data: customer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private (Admin/Employee only)
router.post(
  "/",
  [
    auth,
    authorize("GENERAL_MANAGER", "admin", "employee"),
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phone").isMobilePhone().withMessage("Please enter a valid phone number"),
    body("address.street").notEmpty().withMessage("Street address is required"),
    body("address.city").notEmpty().withMessage("City is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Check if customer with email already exists
      const existingCustomer = await Customer.findOne({ email: req.body.email })
      if (existingCustomer) {
        return res.status(400).json({ message: "Customer with this email already exists" })
      }

      const customer = new Customer({
        ...req.body,
        createdBy: req.user.id,
      })

      await customer.save()
      await customer.populate("createdBy", "name email")

      res.status(201).json({ success: true, data: customer })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private (Admin/Employee only)
router.put("/:id", [auth, authorize("GENERAL_MANAGER", "admin", "employee")], async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email")

    res.json({ success: true, data: updatedCustomer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private (Admin only)
router.delete("/:id", [auth, authorize("GENERAL_MANAGER", "admin")], async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    await Customer.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Customer deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
