const IP = require("../models/IP");

const ipBlocker = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"];

    const ipRecord = await IP.findOne({ ip });

    if (ipRecord && ipRecord.status === "blocked") {
      return res.status(403).json({
        message: "Access denied. Your IP has been blocked.",
      });
    }

    next();
  } catch (error) {
    console.error("IP blocker error:", error);
    next();
  }
};

module.exports = ipBlocker;