const express = require("express");
const router = express.Router();

const statsController = require("../controllers/statsController");

router.get("/overview", statsController.getOverview);

router.get("/top-ips", statsController.getTopIPs);

router.get("/traffic", statsController.getTraffic);

module.exports = router;