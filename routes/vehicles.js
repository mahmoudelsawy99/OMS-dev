const express = require("express")
const Vehicle = require("../models/Vehicle")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true }).sort({ createdAt: -1 })

    res.json({ success: true, data: vehicles })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/vehicles
// @desc    Create new vehicle
// @access  Private (Admin/Employee only)
router.post("/", [auth, authorize("GENERAL_MANAGER", "admin", "employee")], async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body)
    await vehicle.save()

    res.status(201).json({ success: true, data: vehicle })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
