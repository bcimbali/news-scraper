var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const favicon = require('express-favicon');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Used for testing the HTML Scrape.
let testHTML;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.residentadvisor.net/guide/us/chicago").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    testHTML = $.html();
    // Now, within the id of events, we grad every article that has a class of clearfix that's inside of an li tag
    $("li article.clearfix", "#events").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text, href of every link, image, and save them as properties of the result object.
      result.title = $(this)
        .children("a")
        .text();
      result.link = 'https://www.residentadvisor.net' + $(this)
        .children("a")
        .attr("href");
      result.image = 'https://www.residentadvisor.net' + $(this)
        .find("img")
        .attr("src");
      result.venue = $(this)
        .children("p.copy")
        .text();
      result.venueLink = 'https://www.residentadvisor.net' + $(this)
        .children("p.copy")
        .find("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, redirect to home
    res.redirect("/");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every unsaved event/article document in the Articles collection
  db.Article.find({saved: false}).sort({$natural:-1})
    .then(function(dbArticle) {
      // If we were able to successfully find unsaved Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db - API/JSON route
app.get("/articles/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({saved: true})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
      // res.json('root');
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/whatever", function(req, res) {
  res.send("Whatever");
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note -PUT ROUTE
app.put("/articles/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, {saved: true})
  .then(function(saved) {
    // If the User was updated successfully, send it back to the client
    res.json(saved);
  })
});

// Route for saving/updating an Event's/Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
