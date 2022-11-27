#! /usr/bin/env node

console.log('This script populates entries to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(title, description, category, price, stock, cb) {
  itemdetail = {
    title: title,
    description: description,
    category: category,
    price: price,
    stock: stock
  }
  
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, cb) {
  categoryDetail = {
    name: name,
    description: description
  }

  var category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  }   );
}

function createItems(cb) {
    async.series([
        function(callback) {
          itemCreate(
            'God of War: Ragnarok',
            'Journey through dangerous and stunning landscapes while facing a wide variety of enemy creatures, monsters and Norse gods as Kratos and Atreus search for answers.',
            categories[0],
            '$69.99',
            '0',
            callback
          );
        },
        function(callback) {
          itemCreate(
            'Call of Duty | Modern Warfare II',
            'Squad up and fight alongside the iconic operators of Task Force 141 with the return of Modern Warfare.',
            categories[1],
            '$69.99',
            '3',
            callback
          );
        },
        function(callback) {
          itemCreate(
            'Overwatch 2',
            'Overwatch 2 is a free-to-play, team-based action game set in the optimistic future, where every match is the ultimate 5v5 battlefield brawl. Play as a time-jumping freedom fighter, a beat-dropping battlefield DJ, or one of over 30 other unique heroes as you battle it out around the globe.',
            categories[2],
            'Free-to-play',
            'Download only',
            callback
          );
        },
        ],
        // optional callback
        cb);
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate(
            'Adventure',
            'An adventure game is a video game genre in which the player assumes the role of a protagonist in an interactive story driven by exploration and/or puzzle-solving.',
            callback
          );
        },
        function(callback) {
          categoryCreate(
            'First-Person Shooter',
            'First-person shooter is a sub-genre of shooter video games centered on gun and other weapon-based combat in a first-person perspective, with the player experiencing the action through the eyes of the protagonist and controlling the player character in a three-dimensional space.',
            callback
          );
        },
        function(callback) {
          categoryCreate(
            'Hero Shooter',
            'A hero shooter is a subgenre of shooter games that cover both the first-person shooter and third-person shooter genres. These games emphasize "hero" characters that have distinctive abilities and/or weapons that are specific to them.',
            callback
          );
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});