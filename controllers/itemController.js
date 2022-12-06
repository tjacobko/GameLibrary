const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require("express-validator");

// Display site home page
exports.index = (req, res) => {
    async.parallel(
      {
        game_count(callback) {
          Item.countDocuments({}, callback);
        },
        category_count(callback) {
          Category.countDocuments({}, callback);
        }
      },
      (err, results) => {
        res.render("index", {
          title: "GameLibrary Home",
          error: err,
          data: results,
        })
      }
    );
};

// Display list of all items
exports.item_list = (req, res, next) => {
    Item.find({}, "title")
      .sort({ title: 1 })
      .exec((err, list_items) => {
        if (err) {
          return next(err);
        }
        // Successful, so render
        res.render("item_list", {
          title: "Game List",
          item_list: list_items
        });
      });
};

// Display detail page for a specific item.
exports.item_detail = (req, res, next) => {
    Item.findById(req.params.id)
        .populate("category")
        .exec((err, details) => {
          if (err) {
            return next(err);
          }
          // Successful, so render
          res.render("item_detail", {
            title: details.title,
            category: details.category,
            description: details.description,
            price: details.price,
            stock: details.stock,
            details: details
          });
        });
};

// Display item create form on GET.
exports.item_create_get = (req, res, next) => {
  // Get all categories, which we can use for adding to our book.
  Category.find({}, (err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("item_form", {
      form_title: "Create Game",
      categories: categories
    });
  });
};

// Handle item create on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("item_form", {
        title: "Create Game",
        categories: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    // Create an Item object with escaped and trimmed data.
    const game = new Item({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock
    });
    game.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to new item record.
      res.redirect(game.url);
    });
  }
];

// Display item delete form on GET.
exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .populate("category")
    .exec((err, game) => {
      if (err) {
        return next(err);
      }
      if (game == null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("item_delete", {
        game
      });
    });
};

// Handle item delete on POST.
exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndRemove(req.body.gameid, (err) => {
    if (err) {
      return next(err);
    }
    // Success - go to Item List
    res.redirect("/catalog/item");
  });
};

// Display item update form on GET.
exports.item_update_get = (req, res, next) => {
  // Get items for form
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      category(callback) {
        Category.find(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Success, so render.
      res.render("item_form", {
        form_title: "Update Game",
        item: results.item,
        categories: results.category
      });
    }
  );
};

// Handle item update on POST.
exports.item_update_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped/trimmed data and old id.
    const game = new Item({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // Therre are errors. Render form again with sanitized values/error messages.

      // Get categories for the form
      Category.find({}).exec((err, categories) => {
        if (err) {
          return next(err);
        }
        // Successful, so render.
        res.render("item_form", {
          title: "Update Game",
          item: game,
          categories: categories,
          errors: errors.array(),
        });
      });
      return;
    }

    // Data from form is valid. Update the record.
    Item.findByIdAndUpdate(req.params.id, game, {}, (err, thegame) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to the item detail page.
      res.redirect(thegame.url);
    });
  }
];