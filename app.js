const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Express config ////////////////////////////
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Mongoose config ////////////////////////////
mongoose.connect('mongodb://localhost/restful_blog');
const blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes ////////////////////////////
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

// REST: NEW route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// REST: CREATE route
app.post('/blogs', (req, res) => {
  // create blogs
  Blog.create(req.body.blog, (err) => {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});
app.listen(8080, () => {
  console.log('RESTful_blog app running ...');
});
