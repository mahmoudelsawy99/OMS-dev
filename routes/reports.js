const express = require("express")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/reports
// @desc    Get reports
// @access  Private (Admin/Employee only)
router.get("/", [auth, authorize("admin", "employee")], async (req, res) => {
  try {
    // Placeholder for reports logic
    res.json({ success: true, data: [] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
