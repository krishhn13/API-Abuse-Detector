const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const requestLogger = require("./middleware/requestLogger");
const ipRoutes = require("./routes/ips");
const ipBlocker = require("./middleware/ipBlocker");
const abuseDetector = require("./middleware/abuseDetector");
const statsRoutes = require("./routes/stats");
const alertRoutes = require("./routes/alerts");
const logRoutes = require("./routes/logs");

app.use("/api/ips", ipRoutes);
app.use(requestLogger);
app.use(abuseDetector);
app.use(ipBlocker);
app.use("/api/stats", statsRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Abuse Detector Backend Running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));