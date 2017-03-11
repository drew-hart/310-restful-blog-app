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
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// REST: INDEX route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => { // get all blog posts
    if (err) {
      console.log(`error: ${err}`);
    } else {
      res.render('index', { blogs }); // shorthand for { blogs: blogs }
    }
  });
});

app.listen(8080, () => {
  console.log('RESTful_blog app running ...');
});
