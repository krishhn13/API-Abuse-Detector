const IP = require("../models/IP");

exports.getIPs = async (req, res) => {
  try {
    const ips = await IP.find().sort({ createdAt: -1 });
    res.json(ips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.blockIP = async (req, res) => {
  try {
    const { ip, reason } = req.body;

    const updated = await IP.findOneAndUpdate(
      { ip },
      { status: "blocked", reason },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unblockIP = async (req, res) => {
  try {
    const { ip } = req.body;

    const updated = await IP.findOneAndUpdate(
      { ip },
      { status: "allowed", reason: "" },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.whitelistIP = async (req, res) => {
  try {
    const { ip } = req.body;

    const updated = await IP.findOneAndUpdate(
      { ip },
      { status: "allowed", reason: "whitelisted" },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};