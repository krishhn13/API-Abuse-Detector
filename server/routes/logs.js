const express = require("express");
const router = express.Router();

const RequestLog = require("../models/RequestLog");

router.get("/", async (req, res) => {
  try {

    const logs = await RequestLog.find()
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;