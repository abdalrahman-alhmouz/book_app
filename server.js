'use strict';
// The imports
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const path = require('path');

// ............................................................................ configurations 
let app = express();
app.use(cors());
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

// .............................................................................routes-endPoint
app.get('/', handelHome);
app.post('/book', hanelSearch);
app.get('/new', handelSearchForm);
app.get('*', handle404)

// ................................................................................... handlers
function handelHome(req, res) {
    try {
        res.render('pages/index')
    } catch (error) {
        res.send('error : ', error)
    }

}

function handelSearchForm(req, res) {
    try {
        res.render('pages/searches/new')
    } catch (error) {
        res.send('error : ', error)
    }
}

function hanelSearch(req, res) {
    try {
        let url = 'https://www.googleapis.com/books/v1/volumes';
        // console.log('handelSeach data ... ', req.body);
        var objectOfData = {
            q: req.body.search + ' in' + req.body.term
        }
        superagent.get(url).query(objectOfData).then(data => {
            let books = data.body.items.map(book => {
                return new BookResult(book);
            });
            res.render('pages/searches/show', { booksList: books });
        })
    } catch (error) {
        res.send('an error occured : ', error)
    }
}

function handle404(rq, res) {
    try {
        res.send('404 page not found')
    } catch (error) {
        res.send('an error occured : ', error)
    }
}
// .................................................................... data entity
function BookResult(book) {
        var modifiedImg = book.volumeInfo.imageLinks.thumbnail.split(":")[1];
    this.title = book.volumeInfo.title || 'no title';
    this.author = book.volumeInfo.authors || 'Author unkown';
    this.description = book.volumeInfo.description || 'No discription';
    this.imgURL = `https:${modifiedImg}`;


}


app.get('*',(req,res)=>{
    res.status(404).send('this route dose not exist !! ')
})
app.get('/error',(req,res)=>{
    res.render('pages/error');
})

app.listen(PORT, () => {
    console.log('server is running perfectly .. ', PORT)
})