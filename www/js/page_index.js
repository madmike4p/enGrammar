var app = {

    initialize: function() {
        this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on('pagebeforeshow','#chapterPage',  app.prepareBook);
        $(document).on('pagebeforeshow','#exercisePage',  app.prepareChapter);       
    }, // end bindEvents
    
    onDeviceReady: function() {

      $(".navBook").on('click', function () {
        app.currentBook.book = parseInt(this.getAttribute("data-id"));
        $.mobile.changePage('#chapterPage');
        return false;
      });



    }, // onDeviceReady

    prepareBook: function (event) {
      var bookId = app.currentBook.book ;
      
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
        app.currentBook.chapter = parseInt(this.getAttribute("data-id"));
        app.currentBook.sentence = 0;
        $.mobile.changePage('#exercisePage');
        return false;
      });
    },

    prepareChapter: function(event) {
      alert(app.currentBook.book + ' ' + app.currentBook.chapter + ' ' + app.currentBook.sentence);
    },
    
    currentBook: {
      book: -1,
      chapter: -1,
      sentence: -1
    }
};
