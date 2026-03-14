const express = require("express");
const router = express.Router();

const ipController = require("../controllers/ipController");

router.get("/", ipController.getIPs);

router.post("/block", ipController.blockIP);

router.post("/unblock", ipController.unblockIP);

router.post("/whitelist", ipController.whitelistIP);

module.exports = router;