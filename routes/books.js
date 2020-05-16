const express = require("express");
const router = express.Router();
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Author = require('../models/author')


//All Book route
router.get("/", async (req, res) => {
  let searchOptions = {}
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i')
  }
  try {
    const books = await Book.find(searchOptions)  //find all authors {} <- no condition
    res.render("books/index", {
      books: books,
      searchOptions: req.query
    });
  } catch (error) {
     res.redirect('/');
  }
});

//New Book Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book())
});

//Create Book Route 
router.post('/', async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save();
    //res.redirect(`books/${newBook.id}`);
    res.redirect('books')

  } catch (error){
   
    renderNewPage(res, book, true)
    
}
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = "Error creating Book"
    res.render('books/new', params)
  } catch (error) {
    console.log(error)
    res.redirect('/books');
    
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router;
