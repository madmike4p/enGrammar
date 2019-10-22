var app = {
    initialize: function() {
      this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on('pagebeforeshow','#chapterPage',  app.prepareBook);
        $(document).on('pagebeforeshow','#exercisePage',  app.prepareChapter);
        
        $(document).on('pagecreate','#exercisePage',  app.createChapter);
        
        document.getElementById('pl').addEventListener('click', this.cardClick, false);
        document.getElementById('gb').addEventListener('click', this.cardClick, false);

        document.getElementById('nextChapter').addEventListener('click', this.nextChapter, false);
        document.getElementById('prevChapter').addEventListener('click', this.prevChapter, false);
        document.getElementById('configBtn').addEventListener('click', this.configuration, false);
    }, // end bindEvents
    
    onDeviceReady: function() {

      $(".navBook").on('click', function () {
        app._book = parseInt(this.getAttribute("data-id"));
        $.mobile.changePage('#chapterPage');
        return false;
      });

    }, // onDeviceReady

    prepareBook: function (event) {
      var bookId = app._book ;
      
      document.getElementById("bookTitle").innerHTML = books[bookId].title;
      
      var chapters = document.getElementById('chapters');
      
      while (chapters.firstChild) chapters.removeChild(chapters.firstChild);
     
      for (var x = 0; x < books[bookId].length; x++) {
      
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('data-id', x);
        a.className = 'navChapter'
         
        var title = (x < 9) ? '0' + (x + 1) : (x + 1);
        title = title + '. ' + books[bookId][x].title;
        
        var txt = document.createTextNode(title);
        
        a.appendChild(txt);
        li.appendChild(a);
        chapters.appendChild(li);
      }

      //TODO: dorobic to w slowkach
      $('#chapters').listview('refresh');
      
      $(".navChapter").on('click', function () {
        app._chapter = parseInt(this.getAttribute("data-id"));
        app._sentence = 0;
        $.mobile.changePage('#exercisePage');
        return false;
      });
    },
    
    prevChapter: function() {
      if(--app._chapter < 0) app._chapter = books[app._book].length - 1;
      app._exercise = 0;
      document.getElementById('pl').setAttribute('data-click', '0');
      app.showCard('show');
    },

    nextChapter: function() {
      if(++app._chapter >= books[app._book].length) app._chapter = 0;
      app._exercise = 0;
      document.getElementById('pl').setAttribute('data-click', '0');
      app.showCard('show');
    },

    showCard: function(state) {
      var pl = document.querySelector('#pl p');
      var gb = document.querySelector('#gb p');

      var cardPl = document.getElementById('pl');

      switch (state) {
        case 'showEn':
          gb.style.display = 'block';
          break;
        case 'next':
          app._exercise++;
          if (app._exercise >= books[app._book][app._chapter].length) app._exercise = 0;
        case 'show':
          gb.style.display = 'none';
          cardPl.setAttribute('data-click', '0');
          pl.innerHTML = books[app._book][app._chapter][app._exercise].pl;
          gb.innerHTML = books[app._book][app._chapter][app._exercise].en;
          break;
      }
      
      var footerMsg = (app._exercise + 1) + '/' + books[app._book][app._chapter].length;
      document.getElementById('divMsg').innerHTML = footerMsg;

      var title = books[app._book][app._chapter].title.split('|');
      document.getElementById('chapterTitle').innerHTML = title[0];
      
      var subTitle = (!title[1] ? '&nbsp;' : title[1]);
      document.getElementById('chapterSubTitle').innerHTML = subTitle;
    },

    cardClick: function(event) {
      var cardPl = document.getElementById('pl');

      if (cardPl.getAttribute('data-click') == '0') {
        app.showCard('showEn');
        cardPl.setAttribute('data-click', '1');
      } else {
        app.showCard('next');
        cardPl.setAttribute('data-click', '0');
      }
    },
    
    createChapter: function(event) {
        $("#slider-1").on("change", app.confCardHeight);
        $("#slider-2").on("change", app.confFontSize);
        var cardPl = document.getElementById('pl');
        var cardGb = document.getElementById('gb');
        
        var cardTextPl = document.querySelector('#pl p');
        var cardTextEn = document.querySelector('#gb p');
      
        
        if (typeof app.config['cardHeight'] !== 'undefined') {
          var value = app.config['cardHeight'];
          cardPl.style.height = value + 'px';
          cardGb.style.height = value + 'px';
        } 

        if (typeof app.config['fontSize'] !== 'undefined') {
          var value = app.config['fontSize'];
          cardTextPl.style.fontSize = value + 'px';
          cardTextEn.style.fontSize = value + 'px';  
        }
    },
    
    prepareChapter: function(event) {
       app.showCard('show'); 
    },
    
    configuration: function(event) {
      var configPanel = document.getElementById('configPanel');

      var tmp = document.querySelector('div#pl');

      if (configPanel.style.display == '') {
        configPanel.style.display = 'block';
      } else {
        configPanel.style.display = '';
      }
    },
    
    
    
    confFontSize: function(event) {
      var cardTextPl = document.querySelector('#pl p');
      var cardTextEn = document.querySelector('#gb p');
      
      cardTextPl.style.fontSize = this.value + 'px';
      cardTextEn.style.fontSize = this.value + 'px';
      
      app.config['fontSize'] = this.value;
    },

    confCardHeight: function(event) {
      var cardPl = document.getElementById('pl');
      var cardGb = document.getElementById('gb');
      
      cardPl.style.height = this.value + 'px';
      cardGb.style.height = this.value + 'px';

      app.config['cardHeight'] = this.value;
    },
    
    config: window.localStorage,
    
    _book: 0,
    _chapter: 0,
    _exercise: 0,
    _pass: 0
};
