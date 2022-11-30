const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/// Item ROUTES ///

// GET home page.
router.get("/", item_controller.index);

// GET request for list of all Items.
router.get("/item", item_controller.item_list);

// GET request for creating an Item.
router.get("/item/create", item_controller.item_create_get);

// POST request for creating an Item.
router.post("/item/create", item_controller.item_create_post);

// GET request for deleting an Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request for deleting an Item.
router.post("item/:id/delete", item_controller.item_delete_post);

// GET request for updating an Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request for updating an Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for detail page for a specific Item.
router.get("/item/:id", item_controller.item_detail)


/// Category ROUTES ///

// GET request for list of all Categories.
router.get("/category", category_controller.category_list);

// GET request for creating a Category.
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a Category.
router.post("/category/create", category_controller.category_create_post);

// GET request for deleting a Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request for deleting a Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request for updating a Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request for updating a Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for detail page for a specific Category.
router.get("/category/:id", category_controller.category_detail);

module.exports = router;