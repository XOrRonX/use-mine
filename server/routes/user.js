const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const paypal = require("paypal-rest-sdk");

global.totalAmount = 0;

router.get("/user/:id", requireLogin, (req, res) => {
  console.log(req.params.id);
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((arr) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/rate", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.rateid,
    {
      $push: { rating: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { myRating: req.body.rateid },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unrate", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unrateid,
    {
      $pull: { rating: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { myRating: req.body.unrateid },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.post("/pay/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      var itemList = [];
      var total = 0;
      user.cart.map(async (item) => {
        Post.find({ _id: item }).then((post) => {
          var obj = {
            name: post[0].title,
            sku: post[0].price,
            price: post[0].price,
            currency: "ILS",
            quantity: 1,
          };
          total += post[0].price;
          itemList.push(obj);
        });
      });
      setTimeout(function () {
        global.totalAmount = total;
        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
          },
          transactions: [
            {
              item_list: {
                items: itemList,
              },
              amount: {
                currency: "ILS",
                total: global.totalAmount,
              },
              description: "This is the payment description.",
            },
          ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            throw error;
          } else {
            let i;
            console.log(payment);
            for (i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                console.log(payment.links[i].href);
                res.setHeader(
                  "Access-Control-Allow-Origin",
                  req.headers.origin
                );
                res.json({
                  status: "Success",
                  redirect: payment.links[i].href,
                });
              }
            }
          }
        });
      }, 5000);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/success/:id", (req, res) => {
  console.log(req.params.id);
  console.log("I'm here");
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;
  console.log("payerId = " + payerId);
  console.log("paymentId = " + paymentId);

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "ILS",
          total: global.totalAmount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.send("success");
      }
    }
  );
});

router.get("/cancel", (req, res) => res.send("Cancelled"));

module.exports = router;
