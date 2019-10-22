const fs = require('fs');
var vertical = require('./_firstLast').firstLast;
var books = require('./books_01').books;

console.log(vertical);

var _books = Object.getOwnPropertyNames(vertical);

for (var x = 0; x < _books.length; x++) {
  var _chapters = Object.getOwnPropertyNames(vertical[_books[x]]);
  for (var y = 0; y < _chapters.length; y++) {
    var _exercises = Object.getOwnPropertyNames(vertical[_books[x]][_chapters[y]]);
    for (var z = 0; z < _exercises.length; z++) {
      var en = vertical[_books[x]][_chapters[y]][_exercises[z]].en;
      var pl = vertical[_books[x]][_chapters[y]][_exercises[z]].pl;

      books[_books[x]][_chapters[y]][_exercises[z]].en = en;
      books[_books[x]][_chapters[y]][_exercises[z]].pl = pl;


    }
  }
}


fs.writeFileSync('books_02.js', 'exports.books = ' + JSON.stringify(books, null, 2) + ';');
