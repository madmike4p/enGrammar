console.log(dupa);

const fs = require('fs');

var books = {};

var booksTable = [
  'Grammar 1',
  'Grammar 2',
  'Grammar 3',
  'Grammar 4',
  'Grammar 5',
  'Grammar 6',
  'Prasal verbs 1',
  'Prasal verbs 2',
  'Prasal verbs 3',
  'Business 1',
  'Business 2',
  'Business 3'
  ];

for (var x = 0; x < booksTable.length; x++) {
  books[x] = {};
  books[x].title = booksTable[x];
  books.length = booksTable.length;
}

var chapter_id = 0;
for (var x = 0; x < books.length; x++) {
  var pathName = (x < 9) ? "0" + (x + 1) + "/" : (x + 1) + "/";

  // odczyt rozdzialow
  var fileName = pathName + "00.txt";
  var contents = fs.readFileSync(fileName, 'utf8');
  var chapters = contents.split("\n");

  books[x].length = chapters.length;


  for (var y = 0; y < chapters.length; y++) {
    books[x][y] = {};
    books[x][y].title = chapters[y].trim();

    fileName = (y < 9) ? "0" + (y + 1) + ".txt": (y + 1) + ".txt";
    fileName = pathName + fileName;

    var contents = fs.readFileSync(fileName, 'utf8');
    var sentences = contents.trim().split('\n');
    var count = Math.floor(sentences.length / 2);

    books[x][y].length = count;

    // odczyt zdan
    for (var z = 0; z < count; z++) {
      
      books[x][y][z] = {};

      books[x][y][z].pl = sentences[z].trim().replace(/\"/g,"'");
      books[x][y][z].en = sentences[z + 1 + count].trim().replace(/\"/g,"'");


    } // koniec petli sentences
  } // koniec petli chapters
} // koniec petli books


fs.writeFileSync("object.js", "var books = " + JSON.stringify(books) + ";");
fs.writeFileSync("object_pretty.js", JSON.stringify(books, null, 2));

console.log('---');
console.log(books[1].title);
console.log(books[1][1].title);
console.log(books[1][1][1].pl);
console.log(books[1][1][1].en);
