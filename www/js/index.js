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

        document.getElementById('selectScheme').addEventListener('change', this.applyScheme, false);

        var booksItems = document.querySelectorAll('ul#books a');
        for (var x = 0; x < booksItems.length; x++) {
          booksItems[x] .addEventListener('click', this.selectBook, false);
        }

        $(document).keydown(this.keyboardAction);

    }, // bindEvents

    onDeviceReady: function() {
    }, // onDeviceReady

    keyboardAction: function(e) {
      var activePage = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');
      if (activePage == 'exercisePage') {
        if (e.keyCode == 32) app.cardClick();
        if (e.keyCode == 37) app.prevChapter();
        if (e.keyCode == 39) app.nextChapter();
        if (e.keyCode ==  8) $.mobile.changePage('#chapterPage');
      }

      if (activePage == 'chapterPage') {
        if (e.keyCode ==  8) $.mobile.changePage('#bookPage');
      }
      return false;
    },

    beforeShowBooks: function() {
      var badges = document.querySelectorAll('span.ui-li-count');
      for (var x = 0; x < badges.length; x++) {
        badges[x].style.display = 'none';
      }

      if (typeof app.config['last_book'] !== 'undefined') {
        var last = app.config['last_book'];
        var selector = 'a[data-id="' + last + '"] span';
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

      if (typeof app.config['last_book'] !== 'undefined') {
          var last_book = parseInt(app.config['last_book']);
          var last_chapter = parseInt(app.config['last_chapter']);
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
        app._pass = 0;

        
        $.mobile.changePage('#exercisePage');
        return false;
      });
    }, //prepareBook

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
            var msg = '<span class="inChapterTitle">';
            msg += books[app._book][app._chapter].title.split('|').join('<br />');
            msg += '</span><br/><span class="inChapterNumber">"';
            msg += books[app._book].title;
            msg += '", chapter ' + (app._chapter + 1) + ' of ' + books[app._book].length;
            msg += ', pass ' + app._pass;
            msg += '</span>';
            pl.innerHTML = msg;
            gb.style.display = 'none';

            app.config['last_book'] = app._book;
            app.config['last_chapter'] = app._chapter;

          } else {
            gb.style.display = 'none';
            cardPl.setAttribute('data-click', '0');

            pl.innerHTML = books[app._book][app._chapter][app._exercise].pl.replace(/\|/g, '<br/>');
            gb.innerHTML = books[app._book][app._chapter][app._exercise].en.replace(/\|/g, '<br/>');
          }
          break;
      }

      var msg = (app._exercise + 1) + '/' + books[app._book][app._chapter].length + ', pass ' + app._pass;
      document.getElementById('chapterTitle').innerHTML = msg;
    }, // showCard

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
        //addEventListener tu nie dziala, trzeba uzyc jquery
        $("#cardHeightSlider").on("change", app.confCardHeight);
        
        var select = document.getElementById('selectScheme');
        var slider = document.getElementById('cardHeightSlider');
        var schemeList = Object.getOwnPropertyNames(app._colorScheme);
        var currentScheme = '';
        var currentHeight = 0;
        
        // odczyt ustawien i ich aplikacja, jesli brak, to domyslne
        if (typeof app.config['scheme'] !== 'undefined') {
          currentScheme = app.config['scheme'];
        } else {
          currentScheme = schemeList[0];
          app.config['scheme'] = currentScheme;
        }
        
        app.applyScheme(currentScheme);
        
        if (typeof app.config['cardHeight'] !== 'undefined') {
          currentHeight = app.config['cardHeight'];
          slider.value = currentHeight;
          //$("#cardHeightSlider").val(currentHeight);
        } else {
            currentHeight = slider.value;
            app.config['cardHeight'] = currentHeight;
        }
        
        app.confCardHeight(currentHeight);

        for (var x = 0; x < schemeList.length; x++) {
          var option = document.createElement('option');
          option.setAttribute('value', schemeList[x]);
          if (schemeList[x] == currentScheme) {
            option.setAttribute('selected', 'true');
          }
          
          var text = document.createTextNode(schemeList[x]);

          option.appendChild(text);
          select.appendChild(option);
        }

        $(select).selectmenu('refresh');

        var cardPl = document.getElementById('pl');
        var cardGb = document.getElementById('gb');

        var cardTextPl = document.querySelector('#pl p');
        var cardTextEn = document.querySelector('#gb p');

        var cardContainer = document.getElementById('cardContainer');

        

        $("#cardHeightSlider").slider('refresh');

        

    }, // createChapter

    prepareChapter: function(event) {
       app.showCard('show');
    }, // prepareChapter

    configuration: function(event) {
      var configContainer = document.getElementById('configContainer');
      var cardContainer = document.getElementById('cardContainer');

      if (configContainer.style.display == '' || configContainer.style.display == 'none') {
        configContainer.style.display = 'block';
        cardContainer.style.display = 'none';
      } else {
        configContainer.style.display = 'none';
        cardContainer.style.display = 'block'
      }
    }, // configuration

    confCardHeight: function(event) {
      var value = event;
      if (typeof value === 'object') {
        value = this.value;
      }
      

      var cardPl = document.querySelectorAll('.pl');
      for (var x = 0; x < cardPl.length; x++) {
        cardPl[x].style.height = value + 'px';
      }
      

      var cardEn = document.querySelectorAll('.gb');
      for (var x = 0; x < cardEn.length; x++) {
        cardEn[x].style.height = value + 'px';
      }
      
      

      app.config['cardHeight'] = value;
      
      // tu probuje ustawic fonty zaleznie od wysokosci
      var lineHeight = Math.floor(value / 4) * 0.8 + 'px'; 
      var fontSize = Math.floor((value / 4) * 0.7) + 'px';
      
      var elementsPl = document.querySelectorAll('.pl p');
       for (var x = 0; x < elementsPl.length; x++) {
        elementsPl[x].style.lineHeight = lineHeight;
        elementsPl[x].style.fontSize = fontSize; 
      }     
      
      
      var elementsGb = document.querySelectorAll('.gb p');
      for (var x = 0; x < elementsGb.length; x++) {
        elementsGb[x].style.lineHeight = lineHeight;
        elementsGb[x].style.fontSize = fontSize; 
      }



    }, // confCardHeight
    
    applyScheme: function(scheme) {
      if (typeof scheme === 'object') {
        scheme = this.value;
      }
      
      app.config['scheme'] = scheme;
            
      var schemeList = Object.getOwnPropertyNames(app._colorScheme[scheme]);

      for (var x = 0; x < schemeList.length; x++) {

        var cssList = app._colorScheme[scheme][schemeList[x]].replace(/;\s*$/, "").split(';');
        var objList = document.querySelectorAll(schemeList[x])
        
        for (var y = 0; y < objList.length; y++) {
          var obj = objList[y];
          
          for (var z = 0; z < cssList.length; z++) {
            var style = cssList[z].split(':');
            obj.style[style[0].trim()] = style[1].trim();
          }
        }
      }
    }, // applyScheme

    config: window.localStorage,

    _colorScheme: {
      'Light Scheme':
      {
        '.progressBar': 'background-color: red;',
        '.progressBarBackground': 'background-color: white; color: blue;',
        '.pl, .gb': 'background-color: white; color: black;',
        '.pl': 'border-bottom: 1px solid #A7A7A7',
        '.progressBarBackground': 'background-color: white;',
        '.progressBar': 'background-color: #333333;'
      },
      'Dark Scheme':
      {
        '.progressBar': 'background-color: green;',
        '.progressBarBackground': 'background-color: black; color: blue;',
        '.pl, .gb': 'background-color: #333333; color: white',
        '.pl': 'border-bottom: 1px solid #252525',
        '.progressBarBackground': 'background-color: #333333;',
        '.progressBar': 'background-color: #ffffff;'
      }
    },

    _book: 0,
    _chapter: 0,
    _exercise: 0,
    _pass: 0
};
