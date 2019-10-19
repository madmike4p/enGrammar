const fs = require('fs');

var phrases = {};

var phrasesTable = [
  ['Phrasal Verbs', 'phrasalVerbs.txt'],
  ['Idioms', 'idioms.txt']
  ]
  
for (var x = 0; x < phrasesTable.length; x++) {
  phrases[x] = {};
  phrases[x].title = phrasesTable[x][0];
  phrases.length = phrasesTable.length;

  var fileName = phrasesTable[x][1];
  var contents = fs.readFileSync(fileName, 'utf-8');

  var tab = contents.split('\n');
  var count = tab.length / 5;
  
  phrases[x].length = count;

  for (var y = 0; y < count; y++) {
    phrases[x][y] = {};
    
    enKey = tab[0 + y * 5];
    plKey = tab[1 + y * 5];
    en = tab[2 + y * 5];
    pl = tab[3 + y * 5];

    pl = pl.trim().replace(/\"/g,"'");
    en = en.trim().replace(/\"/g,"'");

    phrases[x][y].enKey = enKey.trim();
    phrases[x][y].plKey = plKey.trim();
    phrases[x][y].en = en.trim();
    phrases[x][y].pl = pl.trim();
  }
}


fs.writeFileSync("phrases.js", "var phrases = " + JSON.stringify(phrases) + ";");
fs.writeFileSync("phrases_pretty.js", JSON.stringify(phrases, null, 2));

console.log('test:');
console.log(phrases[0].title);
console.log(phrases[0].length);
console.log();
console.log(phrases[0][15].enKey);
console.log(phrases[0][15].plKey);
console.log(phrases[0][15].en);
console.log(phrases[0][15].pl);
