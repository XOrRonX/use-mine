const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const services = require("./services");

router.get("/user/:id", requireLogin, (req, res) => {
  return services.findUser(req.params.id, res);
});

router.put("/rate", requireLogin, (req, res) => {
  return services.rateUser(req.user._id, req.body.rateid, res);
});

router.put("/unrate", requireLogin, (req, res) => {
  return services.unrateUser(req.user._id, req.body.unrateid, res);
});

router.post("/pay/:id", requireLogin, (req, res) => {
  return services.pay(req.params.id, res);
});

router.post("/success/:id", (req, res) => {
  return services.completePayment(req.body.PayerID, req.body.paymentId, res);
});

router.get("/cancel", (req, res) => res.send("Cancelled"));

module.exports = router;
