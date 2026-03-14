const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");

router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch("/:id/resolve", async (req, res) => {
  try {

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    res.json(alert);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;