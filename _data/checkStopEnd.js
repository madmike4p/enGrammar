const fs = require('fs');
var books = require('./books_01').books;

var lastString = "'`?.!)…’";

var errBook = {};

for (var x = 0; x < books.length; x++) {
  for (var y = 0; y < books[x].length; y++) {
    for (var z = 0; z < books[x][y].length; z++) {

      var en = books[x][y][z].en.trim();
      var pl = books[x][y][z].pl.trim();

      //if (en.indexOf('|') > -1) vertical.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + en);
      //if (pl.indexOf('|') > -1) vertical.push((x + 1) + '\t' + (y + 1) + '\t' + (z + 1) + '\t' + pl);

      var state = false;

      if (en[0] != en[0].toUpperCase()) state = true; 
      if (lastString.indexOf(en[en.length - 1]) < 0) state = true; 

      if (pl[0] != pl[0].toUpperCase()) state = true;
      if (lastString.indexOf(pl[pl.length - 1]) < 0) state = true; 

      if (state) {
        if (typeof errBook[x] === 'undefined')
          errBook[x] = {};

        if (typeof errBook[x][y] === 'undefined')
          errBook[x][y] = {};


        if (typeof errBook[x][y][z] === 'undefined')
          errBook[x][y][z] = {};

        errBook[x][y][z].en = en;
        errBook[x][y][z].pl = pl;

        }
      

      }
    }
  }

fs.writeFileSync('_firsLast.js', 'exports.firstLast = ' + JSON.stringify(errBook, null, 2) + ';');
