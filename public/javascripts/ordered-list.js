$(document).ready(function() {
  var orderedIds = [];
  
  // Receive queue from server, create html for ord-d list
  var getQueue = function() {
    $.ajax('/api/books/queue', {
      success: function(response) {
        window.common.orderedBooks = response;
        var htmlOrdered = window.common.buildBookHtml(window.common.orderedBooks);
        rewriteOrederOfOrderedBooks(htmlOrdered);
        setNewCurrentBook();
      },
      error: function(request, errorType, errorMessage) {
        console.log("Error: " + errorType + " with message: " + errorMessage);
      }
    });
  };

  getQueue();


  function rewriteOrederOfOrderedBooks(list) {
    $(".ordered-books ul").empty();
    $(".ordered-books ul").append(list);
    setTimeout(function() {
      setNewBackground(); //color chief for index
    }, 100);
  }

  //Set bg-color and font-coloe for div with index
  function setNewBackground() {
  $(".ordered-books li").each(function() {
    var myImage = $(this).find("img")[0];
    var indexContainer = $(this).find(".index")[0];

    var colorThief = new ColorThief();
    var color = colorThief.getColor(myImage);
    $(this).find(".index").css('backgroundColor', "rgb(" + color + ")");
  
    setTextColor(color, indexContainer);
    });
  // setHeight();
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

  // Sort ordered list
  $(".ordered-books ul").sortable({ cursor: "move", revert: 200, tolerance: "pointer", placeholder: "sortable-placeholder",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
      findOrderedIds(); //new id's order
      console.log(orderedIds);
      sendOrderOfOrderedToServer(orderedIds); //post our new local array to server
      getQueue(); //new request for queue
    }
  });

  $(".unordered-books ul").sortable({ connectWith: ".connectedSortable", cursor: "move", revert: 200, tolerance: "pointer",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
      findOrderedIds(); //new id's order
      console.log(orderedIds);
      sendOrderOfOrderedToServer(orderedIds); //post our new local array to server
      getQueue(); //new request for queue
    }
  });

  function findOrderedIds() {
    orderedIds = [];
    $(".ordered-books li").each(function() {
      var value = $(this).find('input').val();
      orderedIds.push(parseInt(value));
    });
  }

  function sendOrderOfOrderedToServer(orderedIds) {
    $.post('/api/order/queue', {queue: orderedIds});
  }

  // Set new current bok
  function setNewCurrentBook() {
    currentBook = window.common.orderedBooks[0];
    $(".current-reading .cover").css('background', 'url(' + currentBook.imageUrl + ') no-repeat');
    $(".current-reading .cur-header h3").html(currentBook.title);
    $(".current-reading .cur-header num-of-pages").html(currentBook.pageCount);
    $(".current-reading .details p").html(currentBook.description);
    $(".current-reading .last-page").html(currentBook.pageCount);
    // setNewSliderForNewCurrentBook(currentBook); 
  }

  //Create delete button
  $(".ordered-books").on({
    mouseenter: function() {
      $(this).append("<div class='sorting-delete'>x</div>");
    },
    mouseleave: function() {
      $(this).find('.sorting-delete').remove();
    }
  }, "li");

  // Delete book 
  $('.ordered-books').on('click', '.sorting-delete', function() {
    var el = $(this).closest('li');
    var id = el.find('input').val();
    deleteFromQueueOnServer(id);
  });

  function deleteFromQueueOnServer(index) {
    $.post('/api/books/delete-from-queue', {bookId: index});
    setTimeout(function() {
      getQueue(); // setTimeOut because of parallel functions
    }, 100);
  }
});