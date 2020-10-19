const express = require("express"),
  db = require("../models"),
  router = express.Router(),
  requireAuth = require("../middlewares/requireAuth"),
  _ = require("lodash");

router
  .route("/orders")
  .get(async (req, res, next) => {
    try {
      const customer = await db.models.user.find({
        username: req.body.customer,
      });
      const orders = await db.models.orders
        .find({ customer: customer._id })
        .populate("products")
        .exec({});
      res.status(200).json(orders);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .post(requireAuth, async (req, res, next) => {
    try {
      const customer = await db.models.user.find({
        username: req.body.customer,
      });
      const products = await Promise.all(
        req.body.products.map(async (i, k) => {
          try {
            var x = await db.models.products.findById(i);
            return x._id;
          } catch (e) {
            next({
              status: 500,
              message: e.message,
            });
          }
        })
      );
      const orders = await db.models.orders.create({
        ...req.body,
        customer: customer._id,
        products,
      });

      res.status(200).json(orders);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .delete(requireAuth, async (req, res, next) => {
    try {
      const orders = await db.models.orders.remove({});
      res.status(200).json(orders);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  });

router
  .route("/orders/:id")
  .patch(requireAuth, async (req, res, next) => {
    try {
      var customer = null;
      var order = null;
      var products = null;
      if (req.body.customer) {
        customer = await db.models.user.find({
          username: req.body.customer,
        });
      }
      if (req.body.products) {
        products = await Promise.all(
          req.body.products.map(async (i, k) => {
            try {
              var x = await db.models.products.findById(i);
              return x._id;
            } catch (e) {
              next({
                status: 500,
                message: e.message,
              });
            }
          })
        );
      }
      if (req.body.customer) {
        order = await db.models.orders.findByIdAndUpdate(req.params.id, {
          ...req.body,
          customer: customer._id,
        });
      } else if (req.body.products) {
        order = await db.models.orders.findByIdAndUpdate(req.params.id, {
          ...req.body,
          products,
        });
      } else if(req.body.products && req.body.products) {
        order = await db.models.orders.findByIdAndUpdate(req.params.id, {
          ...req.body,
          customer: customer._id,
          products,
        });
      }else{
        order = await db.models.orders.findByIdAndUpdate(req.params.id,req.body)
      }
      res.status(200).json(order);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .delete(requireAuth, async (req, res, next) => {
    try {
      const order = await db.models.orders.findByIdAndDelete(req.params.id);
      res.status(200).json({ order, msg: "Order Deleted!" });
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  });

module.exports = router;
