$(document).ready(function() {
  $.post('/api/test/super', {name: 'Alex', lastName: 'Bokii'});

  //1. Ajax for unordered list
  $.ajax('/api/books/unordered',  {
    success: function(response) {
      response.forEach (function (book, index) {
        $(".unordered-books ul").append("<li><img src='" + book.imageUrl + "'></li>");
      });
    },
    error: function(request, errorType, errorMessage) {
      console.log("Error: " + errorType + " with message: " + errorMessage);
    }
  });

  //2. Ordered list
  var orderedBooks = [];
  $.ajax('/api/books/queue', {
    success: function(response) {
      response.forEach (function (book, index) {
        console.log(index, book);
        orderedBooks.push(book);
      })
      console.log(orderedBooks);
      WriteOrderedLIstInHtml(orderedBooks);
      setTimeout(function() {
        setNewBackground();
      }, 300);
    },
    error: function(request, errorType, errorMessage) {
      console.log("Error: " + errorType + " with message: " + errorMessage);
    }
  });

  function WriteOrderedLIstInHtml(array) {
    console.log(array);
    var index = 0;
    for (var i = 0; i < array.length; i++) {
      console.log(array[i]);
      $(".ordered-books ul").append("<li>"
          + "<input type='hidden' value='" + array[i].id + "' />"
          + "<img src='" + array[i].imageUrl + "'/>"
          + "<h5>" + array[i].title + "</h5>"
          + "<div class='index'>" + (index+1) + "</div>"
          + "</li>");
      index++;
    }
  }

  //3. Color thief for ordered list
  function setNewBackground() {
  $(".ordered-books li").each(function() {
    var myImage = $(this).find("img")[0];
    var indexContainer = $(this).find(".index")[0];

    var colorThief = new ColorThief();
    var color = colorThief.getColor(myImage);
    $(this).find(".index").css('backgroundColor', "rgb(" + color + ")");
  
    setTextColor(color, indexContainer);
    });
  setHeight();
  }

  function setTextColor(array, container) {
    var colorNumber = array[0] + array[1] + array[2];
    if (colorNumber > 300) {
      $(container).addClass('colorBl');
    }
    else if (colorNumber <= 300) {
      $(container).addClass('colorWh');
    }
  }

  //4. Height of h5 in ordered list
  function setHeight() {
    $(".ordered-books li").each(function() {
      var h5 = $(this).find("h5")[0];
      var img = $(this).find("img")[0];

      var h5Height = $(h5).height();
      var imgHeight = $(img).height();

      var result = 250 - imgHeight - 24 - 20;
      $(h5).height(result);
      console.log(imgHeight, result);
    });
  } 

  //5. Sortable for ordered list
  $('.unordered-books ul').sortable({connectWith: '.ordered-books ul', tolerance: "pointer",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
    }
  });
  $(".ordered-books ul").sortable({ cursor: "move", revert: 200, tolerance: "pointer", placeholder: "sortable-placeholder",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
    }
  });


});