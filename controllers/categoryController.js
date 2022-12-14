const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require("express-validator");

// Display list of all categories
exports.category_list = (req, res, next) => {
    Category.find({}, "name")
        .sort({ name: 1 })
        .exec((err, list_categories) => {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render("category_list", {
                title: "Category List",
                category_list: list_categories
            });
        });
};

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id)
                    .exec(callback);
            },
            games(callback) {
                Item.find({ category: req.params.id })
                    .exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                // No results.
                const err = new Error("Category not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render("category_detail", {
                title: results.category.name,
                description: results.category.description,
                games: results.games,
                category: results.category
            });
        }
    );
};

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = [
    // Validate and sanitize fields.
    body("name", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Create Category",
                category: req.body,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create a Category object with escaped and trimmed data.
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });
        category.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new category record.
            res.redirect(category.url);
        });
    }
];

// Display Category delete form on GET.
exports.category_delete_get = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            item(callback) {
                Item.find({ category : req.params.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                // No results.
                res.redirect("/catalog/category");
            }
            // Successful, so render.
            res.render("category_delete", {
                title: "Delete Category",
                category: results.category,
                items: results.item
            });
        }
    );
};

// Handle Category delete on POST.
exports.category_delete_post = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.body.categoryid).exec(callback);
            },
            items(callback) {
                Item.find({ category : req.body.categoryid }).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // Success
            if (results.items.length > 0) {
                // Category has items. Render in same way as for GET route.
                res.render("category_delete", {
                    title: "Delete Category",
                    category: results.category,
                    items: results.items
                });
                return;
            }
            // Category has no items. Delete object and redirect to the list of categories.
            Category.findByIdAndRemove(req.body.categoryid, (err) => {
                if (err) {
                    return next(err)
                }
                // Success - go to category list
                res.redirect("/catalog/category");
            });
        }
    );
};

// Display Category update form on GET.
exports.category_update_get = (req, res, next) => {
    Category.findById(req.params.id).exec((err, category) => {
        if (err) {
            return next(err);
        }
        res.render("category_form", {
            title: "Update Category",
            category: category
        });
    });
};

// Handle Category update on POST.
exports.category_update_post = [
    // Validate and sanitize fields.
    body("name", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array()
            });
            return;
        }

        Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
            if (err) {
                return next(err);
            }
            res.redirect(thecategory.url);
        });
    }
];