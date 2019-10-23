const fs = require('fs');

var header = fs.readFileSync('header.html', 'utf-8');
var footer = fs.readFileSync('footer.html', 'utf-8');

var content = fs.readFileSync('info.txt', 'utf-8');

var chapters = content.split('-----');

var html = [];

var current = chapters[0];

//pobieram numer
chapter = current.split('\n');
var nr = chapter.shift();

chapter = chapter.join('\n').trim().split('\n');

for (var x = 0; x < chapter.length; x++) {
  if (chapter[x].trim() == '') chapter[x] = '***';
}

chapter = chapter.join('\n').split('***');


console.log(chapter);







header = header + '\n\n\n';
footer = '\n\n\n' + footer;
fs.writeFileSync('index.html', header + html.join('\n') + footer);
