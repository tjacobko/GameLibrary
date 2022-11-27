const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/// Item ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for list of all Items.
router.get("/item", item_controller.item_list);

// GET request for creating an item.
router.get("/item/create", item_controller.item_create_get);

router.get("item/create")


/// Category ROUTES ///

// GET request for list of all Categories.
router.get("/category", category_controller.category_list);


module.exports = router;