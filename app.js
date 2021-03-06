const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

// Express config ////////////////////////////
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

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
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err) => {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// REST: SHOW route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('blogs');
    } else {
      res.render('show', { blog });
    }
  });
});

// REST: EDIT route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(`error: ${err}`);
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog });
    }
  });
});

// REST: Update route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// REST: Destroy route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(`error: ${err}`);
      res.redirect('/blogs'); // placeholder for now
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(8080, () => {
  console.log('RESTful_blog app running ...');
});
