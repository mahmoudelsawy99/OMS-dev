const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/", [auth, authorize("admin")], async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role
    }

    // Filter by status
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true"
    }

    const users = await User.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: users,
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

// @route   POST /api/users
// @desc    Create new user (Admin only)
// @access  Private
router.post(
  "/",
  [
    auth,
    authorize("admin"),
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["admin", "employee", "client", "supplier"]).withMessage("Valid role is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: req.body.email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      const user = new User({
        ...req.body,
        createdBy: req.user.id,
      })

      await user.save()

      res.status(201).json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put("/:id", [auth, authorize("admin")], async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Don't allow password update through this route
    delete req.body.password

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
