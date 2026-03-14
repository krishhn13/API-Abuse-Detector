const RequestLog = require("../models/RequestLog");
const Alert = require("../models/Alert");

exports.getOverview = async (req, res) => {
  try {

    const totalRequests = await RequestLog.countDocuments();

    const totalAlerts = await Alert.countDocuments();

    const errorRequests = await RequestLog.countDocuments({
      status: { $gte: 400 }
    });

    const errorRate = totalRequests === 0
      ? 0
      : ((errorRequests / totalRequests) * 100).toFixed(2);

    res.json({
      totalRequests,
      totalAlerts,
      errorRequests,
      errorRate
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getTopIPs = async (req, res) => {
  try {

    const topIPs = await RequestLog.aggregate([
      {
        $group: {
          _id: "$ip",
          requestCount: { $sum: 1 }
        }
      },
      { $sort: { requestCount: -1 } },
      { $limit: 10 }
    ]);

    res.json(topIPs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getTraffic = async (req, res) => {
  try {

    const traffic = await RequestLog.aggregate([
      {
        $group: {
          _id: {
            minute: { $minute: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.hour": 1, "_id.minute": 1 } }
    ]);

    res.json(traffic);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};