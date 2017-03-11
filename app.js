const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Express config ////////////////////////////
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose config ////////////////////////////
mongoose.connect('mongodb://localhost/restful_blog');
const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTful App ////////////////////////////
app.listen(8080, () => {
  console.log('RESTful_blog app running ...');
});
