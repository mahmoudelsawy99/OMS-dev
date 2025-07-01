const express = require("express")
const Shipment = require("../models/Shipment")
const { auth } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/shipments
// @desc    Get all shipments
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("order").populate("vehicle").sort({ createdAt: -1 })

    res.json({ success: true, data: shipments })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
