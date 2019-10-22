const fs = require('fs');
var books = require('./books_02').books;


var book = -1;
var chapter = -1;
var exercise = -1;
var max = 0;
var maxStr = '';
var count = 0;

for (var x = 0; x < books.length; x++) {
  for (var y = 0; y < books[x].length; y++) {
    for (var z = 0; z < books[x][y].length; z++) {

      var en = books[x][y][z].en.trim();
      var pl = books[x][y][z].pl.trim();


      if (en.length > max) {
        max = en.length;
        maxStr = en;
        book = x;
        chapter = y;
        exercise = z;
      }

      if (pl.length > max) {
        max = pl.length;
        maxStr = pl;
        book = x;
        chapter = y;
        exercise = z;
      }

    }
  }
}
console.log(maxStr);
console.log(book);
console.log(chapter);
console.log(exercise);
