const fs = require('fs');
var myBooks = require('./books');
var books = myBooks.getBooks();

var errFirst = [];
var errLast = [];
var slash = [];
var vertical = [];
var max = 0;
var maxString = '';

var lastString = "'`?.!)…’";

for (var x = 0; x < books.length; x++) {
  for (var y = 0; y < books[x].length; y++) {
    for (var z = 0; z < books[x][y].length; z++) {
      var en = books[x][y][z].en.trim();
      var pl = books[x][y][z].pl.trim();

      if (en.indexOf('|') > -1) vertical.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + en);
      if (pl.indexOf('|') > -1) vertical.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + pl);

      if (en[0] != en[0].toUpperCase()) errFirst.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + en);
      if (lastString.indexOf(en[en.length - 1]) < 0) errLast.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + en);
      if (en.indexOf('/') > 0) slash.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + en);

      if (pl[0] != pl[0].toUpperCase()) errFirst.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + pl);
      if (lastString.indexOf(pl[pl.length - 1]) < 0) errLast.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + pl);
      if (pl.indexOf('/') > 0) slash.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + pl);
      

      var tmpString = en;
      if (pl.length > en.length) tmpString = pl;

      if (tmpString.length > max) {
        max = tmpString.length;
        maxString = tmpString;
      }
    }
  }
}

var fileString = '';
fileString += 'VERTICAL:\n';
fileString += vertical.join('\n') + '\n\n';
fileString += 'FIRST:\n';
fileString += errFirst.join('\n') + '\n\n';
fileString += 'LAST:\n';
fileString += errLast.join('\n') + '\n\n';
fileString += 'SLASH:\n';
fileString += slash.join('\n') + '\n\n';
fileString += 'MAX:\n';
fileString += 'max: ' + max + '\n';
fileString += 'max: ' + maxString;

fs.writeFileSync("books_errors.txt", fileString);
