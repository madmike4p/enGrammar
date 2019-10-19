var app = {

    initialize: function() {
        this.bindEvents();
    }, // end initialize

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }, // end bindEvents
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        alert(books[2][3][10].pl + '\n' + books[2][3][10].pl);
    }, // onDeviceReady

    dbMessage: function(msg) {
      document.getElementById("divMsg").innerHTML = msg;
    }, // end dbMessage

    receivedEvent: function(id) {
    } // receivedEvent
};
