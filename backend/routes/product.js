const express = require("express"),
  db = require("../models"),
  router = express.Router(),
  requireAuth = require("../middlewares/requireAuth"),
  _ = require("lodash");

router
  .route("/products")
  .get(async (req, res, next) => {
    try {
      var products = [];
      if (req.query) {
        products = await db.models.products
          .find(_.omit(req.query, "limit"))
          .limit(+req.query.limit)
          .exec({});
      } else if (req.query && !req.query.limit) {
        products = await db.models.products.find(req.query);
      } else if (req.query.limit) {
        products = await db.models.products
          .find({})
          .limit(+req.query.limit)
          .exec({});
      } else {
        products = await db.models.products.find({});
      }
      res.status(200).json(products);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .post(requireAuth, async (req, res, next) => {
    try {
      if (req.user.isAdmin) {
        const product = await db.models.products.create(req.body);
        res.status(201).json(product);
      } else {
        throw new Error("You are not an admin");
      }
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .delete(requireAuth, async (req, res, next) => {
    try {
      if (req.user.isAdmin) {
        const product = await db.models.products.remove();
        res.status(201).json(product);
      } else {
        throw new Error("You are not an admin");
      }
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  });

router
  .route("/products/:id")
  .get(async (req, res, next) => {
    try {
      const product = await db.models.products.findById(req.params.id);
      res.status(200).json(product);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .put(requireAuth, async (req, res, next) => {
    try {
      const product = await db.models.products.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.status(200).json(product);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  })
  .delete(requireAuth, async (req, res, next) => {
    try {
      const product = await db.models.products.findByIdAndRemove(req.params.id);
      res.status(200).json(product);
    } catch (e) {
      next({
        status: 500,
        message: e.message,
      });
    }
  });

module.exports = router;
