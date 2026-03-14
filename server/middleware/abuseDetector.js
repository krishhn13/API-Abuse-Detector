const RequestLog = require("../models/RequestLog");
const Alert = require("../models/Alert");
const IP = require("../models/IP");

const abuseDetector = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"];

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const requestCount = await RequestLog.countDocuments({
      ip,
      timestamp: { $gte: oneMinuteAgo }
    });

    if (requestCount > 20) {

      // mark IP suspicious
      await IP.findOneAndUpdate(
        { ip },
        { status: "suspicious", reason: "Too many requests" },
        { upsert: true }
      );

      // create alert
      await Alert.create({
        type: "rate_limit",
        message: `High request rate detected from ${ip}`,
        ip,
        severity: "high"
      });

    }

    next();
  } catch (error) {
    console.error("Abuse detector error:", error);
    next();
  }
};

module.exports = abuseDetector;