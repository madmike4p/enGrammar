var app = {
    initialize: function() {
      this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on('pagebeforeshow', '#chapterPage',  app.prepareBook);
        $(document).on('pagebeforeshow', '#exercisePage',  app.prepareChapter);
        $(document).on('pagebeforeshow', '#bookPage', app.beforeShowBooks);
        
        $(document).on('pagecreate','#exercisePage',  app.createChapter);
        
        document.getElementById('pl').addEventListener('click', this.cardClick, false);
        document.getElementById('gb').addEventListener('click', this.cardClick, false);

        document.getElementById('nextChapter').addEventListener('click', this.nextChapter, false);
        document.getElementById('prevChapter').addEventListener('click', this.prevChapter, false);
        document.getElementById('configBtn').addEventListener('click', this.configuration, false);

        var booksItems = document.querySelectorAll('ul#books a');
        for (var x = 0; x < booksItems.length; x++) {
          booksItems[x] .addEventListener('click', this.selectBook, false);
        }
    }, // bindEvents
    
    onDeviceReady: function() {
    }, // onDeviceReady

    beforeShowBooks: function() {
      var badges = document.querySelectorAll('span.ui-li-count');
      for (var x = 0; x < badges.length; x++) {
        badges[x].style.display = 'none';
      }

      if (typeof app.config['last'] !== 'undefined') {
        var last = app.config['last'];
        var selector = 'a[data-id="' + last.split('_')[0] + '"] span';
        var badge = document.querySelector(selector);
        badge.style.display = 'block';
      }
    }, // beforeShowBooks

    selectBook: function(even) {
      app._book = parseInt(this.getAttribute("data-id"));
      $.mobile.changePage('#chapterPage');
      return false;
    }, // selectBook

    prepareBook: function (event) {
      var bookId = app._book ;
      document.getElementById("bookTitle").innerHTML = books[bookId].title;
      
      var chapters = document.getElementById('chapters');
      
      while (chapters.firstChild) chapters.removeChild(chapters.firstChild);
     
      var last_book = -1;
      var last_chapter = -1;
      
      if (typeof app.config['last'] !== 'undefined') {
          var last_book = parseInt(app.config['last'].split('_')[0]);
          var last_chapter = parseInt(app.config['last'].split('_')[1]);
        }
     
      for (var x = 0; x < books[bookId].length; x++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('data-id', x);
        a.className = 'navChapter'
         
        var title = (x < 9) ? '0' + (x + 1) : (x + 1);
        title = title + '. ' + books[bookId][x].title;
        
        var txt = document.createTextNode(title);
        
        a.appendChild(txt);

        if (last_book == app._book && last_chapter == x) {
          var badge = document.createElement('span');
          badge.className = 'ui-li-count';
          
          var asterisk = document.createTextNode('*');
          badge.appendChild(asterisk);
          a.appendChild(badge);
        }
        
        li.appendChild(a);
        chapters.appendChild(li);
      }

      $('#chapters').listview('refresh');
      
      $(".navChapter").on('click', function () {
        app._chapter = parseInt(this.getAttribute("data-id"));
        
        document.getElementById('pl').setAttribute('data-click', '2');
        app._exercise = 0;
        app._pass = 1;
        $.mobile.changePage('#exercisePage');
        return false;
      });
    },
    
    prevChapter: function() {
      if(--app._chapter < 0) app._chapter = books[app._book].length - 1;
      app._exercise = 0;
      app._pass = 0;
      document.getElementById('pl').setAttribute('data-click', '2');
      app.showCard('show');
    }, // prevChapter

    nextChapter: function() {
      if(++app._chapter >= books[app._book].length) app._chapter = 0;
      app._exercise = 0;
      app._pass = 0;
      document.getElementById('pl').setAttribute('data-click', '2');
      app.showCard('show');
    }, //nextChapter

    showCard: function(state) {
      var pl = document.querySelector('#pl p');
      var gb = document.querySelector('#gb p');

      var cardPl = document.getElementById('pl');
      var cardState = cardPl.getAttribute('data-click');

      switch (state) {
        case 'showEn':
          gb.style.display = 'block';
          cardPl.setAttribute('data-click', '1');
          break;
        case 'next':
          app._exercise++;


          if (app._exercise >= books[app._book][app._chapter].length) {
            app._exercise = 0;
            cardPl.setAttribute('data-click', '2');
            cardState = 2;
          }
        case 'show':

          var width = Math.floor((100 / books[app._book][app._chapter].length) * app._exercise);
          document.getElementById('progressBar').style.width = width + '%';

          if (cardState == '2') {
            app._pass++;
            var msg = '<span class="inBookTitle">';
            msg += books[app._book].title;
            msg += '</span><br/><span class="inChapterTitle">';
            msg += books[app._book][app._chapter].title.split('|').join('<br/>');
            msg += '</span><br/><span class="inChapterNumber">';
            msg += 'chapter ' + (app._chapter + 1) + ' of ' + books[app._book].length;
            msg += '</span>';
            pl.innerHTML = msg; 
            gb.style.display = 'none';
            app.config['last'] = app._book + '_' + app._chapter;
            
          } else {
            gb.style.display = 'none';
            cardPl.setAttribute('data-click', '0');
            
            pl.innerHTML = books[app._book][app._chapter][app._exercise].pl.replace(/\|/g, '<br/>');
            gb.innerHTML = books[app._book][app._chapter][app._exercise].en.replace(/\|/g, '<br/>');
          }
          break;
      }
      
      var footerMsg ='sentence ' + (app._exercise + 1) + ' of ';
      footerMsg += books[app._book][app._chapter].length + ', pass ' + app._pass;
      document.getElementById('chapterTitle').innerHTML = footerMsg;
    }, // showCards

    cardClick: function(event) {
      var cardPl = document.getElementById('pl');
      var cardState = cardPl.getAttribute('data-click');
     

     switch (cardState) {
        case '0':
          app.showCard('showEn');
          break;
        case '1':
          app.showCard('next');
          break;
        case '2':
          cardPl.setAttribute('data-click', '1');
          app.showCard('show');
          break;
      }
    }, //cardClick
    
    createChapter: function(event) {
        $("#slider-1").on("change", app.confCardHeight);
        $("#slider-2").on("change", app.confFontSize);
        $("#slider-3").on("change", app.confCardRightMargin);
        
        var cardPl = document.getElementById('pl');
        var cardGb = document.getElementById('gb');
        
        var cardTextPl = document.querySelector('#pl p');
        var cardTextEn = document.querySelector('#gb p');
        
        var cardContainer = document.getElementById('cardContainer');
      
        
        if (typeof app.config['cardHeight'] !== 'undefined') {
          var value = app.config['cardHeight'];
          $("#slider-1").val(value);
          cardPl.style.height = value + 'px';
          cardGb.style.height = value + 'px';
        } 

        if (typeof app.config['fontSize'] !== 'undefined') {
          var value = app.config['fontSize'];
          $("#slider-2").val(value);
          cardTextPl.style.fontSize = value + 'px';
          cardTextEn.style.fontSize = value + 'px';  
        }
        
        if (typeof app.config['cardRightMargin'] !== 'undefined') {
          var value = app.config['cardRightMargin'];
          $("#slider-3").val(value);
          cardContainer.style.marginRight = value + 'px';
        }
        
        $("#slider-1").slider('refresh');
        $("#slider-2").slider('refresh');
        $("#slider-3").slider('refresh');
    },
    
    prepareChapter: function(event) {
       app.showCard('show'); 
    }, // prepareChapter
    
    configuration: function(event) {
      var configPanel = document.getElementById('configPanel');

      var tmp = document.querySelector('div#pl');

      if (configPanel.style.display == '') {
        configPanel.style.display = 'block';
        var scrollTo = document.getElementById('slider-3');
        scrollTo.scrollIntoView();
      } else {
        configPanel.style.display = '';
      }
    }, // configuration
    
    confFontSize: function(event) {
      var cardTextPl = document.querySelector('#pl p');
      var cardTextEn = document.querySelector('#gb p');
      
      cardTextPl.style.fontSize = this.value + 'px';
      cardTextEn.style.fontSize = this.value + 'px';
      
      app.config['fontSize'] = this.value;
    }, // confCardFondSize

    confCardHeight: function(event) {
      var cardPl = document.getElementById('pl');
      var cardGb = document.getElementById('gb');
      
      cardPl.style.height = this.value + 'px';
      cardGb.style.height = this.value + 'px';

      app.config['cardHeight'] = this.value;
    }, // confCardHeight
    
    confCardRightMargin: function(event) {
      var cardContainer = document.getElementById('cardContainer');
      cardContainer.style.marginRight = this.value + 'px';
      app.config['cardRightMargin'] = this.value;   
    }, // confCardRightMargin
    
    config: window.localStorage,
    
    _book: 0,
    _chapter: 0,
    _exercise: 0,
    _pass: 0
};
