const fs = require('fs');
var books = require('./books_01');

var errBook = {};

for (var x = 0; x < tab.length; x++) {
  var line = tab[x].trim();

  line = line.replace(/\t/g, ' ');
  line = line.replace(/  /g, ' ');

  var param = line.split(' ');

  var bookId = parseInt(param[0]) - 1;
  var chapterId = parseInt(param[1]) - 1;
  var exerciseId = parseInt(param[2]) - 1;

  if (typeof errBook[bookId] === 'undefined')
    errBook[bookId] = {};

  if (typeof errBook[bookId][chapterId] === 'undefined')
    errBook[bookId][chapterId] = {};


  if (typeof errBook[bookId][chapterId][exerciseId] === 'undefined')
    errBook[bookId][chapterId][exerciseId] = {};

  var en = correct(books[bookId][chapterId][exerciseId].en);
  var pl = correct(books[bookId][chapterId][exerciseId].pl);

  errBook[bookId][chapterId][exerciseId].en = en;
  errBook[bookId][chapterId][exerciseId].pl = pl;
}

fs.writeFileSync('vertical.js', 'exports.vertical = ' + JSON.stringify(errBook, null, 2) + ';');
