var app = {
    initialize: function() {
      this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on('pagebeforeshow','#chapterPage',  app.prepareBook);
        $(document).on('pagebeforeshow','#exercisePage',  app.prepareChapter);
        
        $(document).on('pagecreate','#exercisePage',  app.createChapter);
        
        document.getElementById('button').addEventListener('click', this.btnClick, false);
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
      document.getElementById('button').setAttribute('data-click', '0');
      app.showCard('show');
    },

    nextChapter: function() {
      if(++app._chapter >= books[app._book].length) app._chapter = 0;
      app._exercise = 0;
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
          app._exercise++;
          if (app._exercise >= books[app._book][app._chapter].length) app._exercise = 0;
        case 'show':
          en.style.display = 'none';
          button.setAttribute('data-click', '0');
          pl.innerHTML = books[app._book][app._chapter][app._exercise].pl;
          en.innerHTML = books[app._book][app._chapter][app._exercise].en;
          break;
      }
      
      var footerMsg = (app._exercise + 1) + '/' + books[app._book][app._chapter].length;
      document.getElementById('divMsg').innerHTML = footerMsg;



      var title = books[app._book][app._chapter].title.split('|');
      document.getElementById('chapterTitle').innerHTML = title[0];
      

      
      var subTitle = (!title[1] ? '&nbsp;' : title[1]);
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
    },
    
    createChapter: function(event) {
        $("#slider-3").on("change", app.confPanelWidth);
        $("#slider-2").on("change", app.confFontSize);
      
        var cardLeftPanelWidth = document.getElementById('leftPanel');
        var cardRightPanelWidth = document.getElementById('rightPanel');
        
        var cardTextPl = document.getElementById('pl');
        var cardTextEn = document.getElementById('en');
      
        
        if (typeof app.config['panelHeight'] !== 'undefined') {
          alert('defined');
        } 
        
        if (typeof app.config['leftPanelWidth'] !== 'undefined') {
          var value = parseInt(app.config['leftPanelWidth']);
          cardLeftPanelWidth.style.width = value + '%';
          cardRightPanelWidth.style.width = 99 - value + '%';
        } 
          
        if (typeof app.config['fontSize'] !== 'undefined') {
          var value = app.config['fontSize'];
          cardTextPl.style.fontSize = value + 'px';
          cardTextEn.style.fontSize = value + 'px';  
        }
     
    },
    
    prepareChapter: function(event) {
      // ---------------------------------------
       app.showCard('show'); 
    },
    
    configuration: function(event) {

      
      
  
    },
    
    confPanelWidth: function(event) {
      var cardLeftPanelWidth = document.getElementById('leftPanel');
      var cardRightPanelWidth = document.getElementById('rightPanel');
      var value = parseInt(this.value);
   
      cardLeftPanelWidth.style.width = value + '%';
      cardRightPanelWidth.style.width = 99 - value + '%';      
      
      app.config['leftPanelWidth'] = value;
    },
    
    confFontSize: function(event) {
      var cardTextPl = document.getElementById('pl');
      var cardTextEn = document.getElementById('en');
      
      cardTextPl.style.fontSize = this.value + 'px';
      cardTextEn.style.fontSize = this.value + 'px';
      
      app.config['fontSize'] = this.value;
    },
    
    config: window.localStorage,
    
    _book: 0,
    _chapter: 0,
    _exercise: 0,
    _pass: 0
};
