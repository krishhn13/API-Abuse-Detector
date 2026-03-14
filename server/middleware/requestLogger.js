const RequestLog = require("../models/RequestLog");

const requestLogger = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const log = new RequestLog({
        ip: req.ip || req.headers["x-forwarded-for"],
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        responseTime: Date.now() - start,
        userAgent: req.headers["user-agent"],
      });

      await log.save();
    } catch (error) {
      console.error("Logging error:", error);
    }
  });

  next();
};

module.exports = requestLogger;