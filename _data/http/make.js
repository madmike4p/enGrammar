const fs = require('fs');

var header = fs.readFileSync('header.html', 'utf-8');
var footer = fs.readFileSync('footer.html', 'utf-8');
var content = fs.readFileSync('Info.txt', 'utf-8');

var chapters = content.split('-----');

function makeTable(tab) {
  var chapter = tab.split('\n');
  var start = -1;
  var stop = -1;

  for (var x = 0; x < chapter.length; x++) {

    if (chapter[x].indexOf('|') > -1) {
      if(start == -1) start = x;
      stop = x;
      var parts = chapter[x].split('|');
      for (var z = 0; z < parts.length; z++) {
        parts[z] = parts[z].trim();
      }
      parts = '<tr><td>' + parts.join('</td><td>') + '</td></tr>';
      chapter[x] = parts;
      } else {
      chapter[x] = '<p>' + chapter[x] + '</p>';
      }
  }

  if (start != -1) {
    chapter[start] = '<table>' + chapter[start];
    chapter[stop] = chapter[stop] + '</table>';
  }

  return chapter.join('\n');

}

for (var x = 0; x < chapters.length; x++) {
  if (x != 2) continue;

  var chapter = chapters[x];

  //pobieram numer
  chapter = chapter.split('\n');
  var nr = chapter.shift();

  chapter = chapter.join('\n').trim().split('\n');
  for (var y = 0; y < chapter.length; y++) {
    if (chapter[y].trim() == '') chapter[y] = '***';
    }
  chapter = chapter.join('\n').split('***\n');
  for (var y = 0; y < chapter.length; y++) {
    chapter[y] = chapter[y].trim();
    chapter[y] = makeTable(chapter[y]);
    //makeTable(chapter[y]);
  }

  // tutaj mam wszysko podzielone na chmurki
  console.log(chapter);
}






header = header + '\n\n\n';
footer = '\n\n\n' + footer;
// fs.writeFileSync('index.html', header + html.join('\n') + footer);
