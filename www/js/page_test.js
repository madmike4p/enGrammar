var book = 0;
var chapter = 0;
var exercise = 0;

var app = {

    initialize: function() {
        this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('button').addEventListener('click', this.btnClick, false);
        document.getElementById('nextChapter').addEventListener('click', this.nextChapter, false);
        document.getElementById('prevChapter').addEventListener('click', this.prevChapter, false);
    }, // end bindEvents

    onDeviceReady: function() {
      app.showCard('show');
    }, 

    prevChapter: function() {
      if(--chapter < 0) chapter = books[book].length - 1;
      exercise = 0;
      document.getElementById('button').setAttribute('data-click', '0');
      app.showCard('show');
    },

    nextChapter: function() {
      if(++chapter >= books[book].length) chapter = 0;
      exercise = 0;
      document.getElementById('button').setAttribute('data-click', '0');
      app.showCard('show');
    },

    showCard: function(state) {
      var pl = document.getElementById('pl');
      var en = document.getElementById('en');
      var btn = document.getElementById('button');

      switch (state) {
        case 'showEn':
          en.style.display = 'block';
          break;
        case 'next':
          exercise++;
          if (exercise >= books[book][chapter].length) exercise = 0;
        case 'show':
          en.style.display = 'none';
          button.setAttribute('data-click', '0');
          pl.innerHTML = books[book][chapter][exercise].pl;
          en.innerHTML = books[book][chapter][exercise].en;
          break;
      }
      document.getElementById('divMsg').innerHTML = (exercise + 1) + '/' + books[book][chapter].length;
      //document.getElementById('chapterSubTitle').innerHTML = '&nbsp';


      var title = books[book][chapter].title.split('|');
      document.getElementById('chapterTitle').innerHTML = title[0];
      
      var subTitle = (typeof title[1] == undefined ? '&nbsp' : title[1]);
      document.getElementById('chapterSubTitle').innerHTML = subTitle;
    },

    btnClick: function(event) {
      if (this.getAttribute('data-click') == '0') {
        app.showCard('showEn');
        this.setAttribute('data-click', '1');
      } else {
        app.showCard('next');
        this.setAttribute('data-click', '0');
      }
    } 
};
