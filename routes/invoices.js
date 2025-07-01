const express = require("express")
const { auth } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // Placeholder for invoice logic
    res.json({ success: true, data: [] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
