var style = {
  'font-size': '20px',
  'width': '300px',
  'padding': '30px'
};

for (prop in style) {
  console.log(prop + " " + style[prop]);
}

var jsonStr = JSON.stringify(style);
console.log(jsonStr);

var newObj = JSON.parse(jsonStr);
console.log(newObj['font-size']);




if (typeof dupa === 'undefined') {
  console.log('undefined');
} else {
  console.log("defined");
}
