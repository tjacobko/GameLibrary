const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');

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
exports.item_list = (req, res) => {
    res.send("NOT IMPLEMENTED: Item List");
};

// Display detail page for a specific item.
exports.item_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
};

// Display item create form on GET.
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item create GET");
};

// Handle item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item create POST");
};

// Display item delete form on GET.
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item delete GET");
};

// Handle item delete on POST.
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item delete POST");
};

// Display item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: item update GET");
};

// Handle item update on POST.
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: item update POST");
};