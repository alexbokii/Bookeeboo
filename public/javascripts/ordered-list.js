  (function() {
  var orderedBooksArray = [];
  // var currentBook;

  var orderedBooks = bookeeboo.orderedBooks = {
    //initialise
    init: function() {
      getQueue(redrawOrderedListInHtml);

      $(".ordered-books ul").sortable(sortingOrderedBooks);

      $(".ordered-books").on({
        mouseenter: function() {$(this).append("<div class='sorting-delete'></div>");},
        mouseleave: function() {$(this).find('.sorting-delete').remove();}
      }, "li:not('.empty')");

      $('.ordered-books').on('click', '.sorting-delete', function() {
        var el = $(this).closest('li');
        var id = el.find('input').val();
        deleteFromQueueOnServer(id);
      });
    }
  };

  //sorting parameters
  var sortingOrderedBooks = {
    cursor: "move",
    revert: 200,
    tolerance: "pointer",
    placeholder: "sortable-placeholder",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
      var orderedIds = findOrderedIds();
      postChangesInOrderedBooks(orderedIds);
      updateOrderedBooksIndexes();  
    },
    receive: function( event, ui ) {
      var unorderedIds = findUnorderedIds();
      console.log(unorderedIds);
      $.post('/api/order/unordered', {unordered: unorderedIds});

      var orderedIds = findOrderedIds();
      $.post('/api/order/queue', {queue: orderedIds}, function() {
        getQueue(redrawOrderedListInHtml);
      });
    }
  };

  function updateOrderedBooksIndexes() {
    $('.ordered-books li').each(function(index) {
      $(this).find('.index').html(index + 1);
    });
  }

  function getQueue(successCallback) {
    $.ajax('/api/books/queue', {
      success: function(response) {
        orderedBooksArray = response;
        bookeeboo.currentBook.setNewCurrentBook(orderedBooksArray[0]);

        if (typeof(successCallback) == "function") {
          successCallback();  
        }
      },
      error: function(request, errorType, errorMessage) {
        console.log("Error: " + errorType + " with message: " + errorMessage);
      }
    });
  }

  function redrawOrderedListInHtml() {
    var htmlOrdered = common.buildBookHtml(orderedBooksArray);
    rewriteOrderOfOrderedBooks(htmlOrdered);
  }

  function postChangesInOrderedBooks(orderedIds) {
    $.post('/api/order/queue', {queue: orderedIds}, getQueue);
  }

  function rewriteOrderOfOrderedBooks(list) {
    $(".ordered-books ul").empty();

    if(list.length === 0) {
      $(".ordered-books ul").append('<li class="empty">Nothing in your reading queue. Add your books and start reading.</li> ');
      return;
    }
    
    $(".ordered-books ul").append(list);

    $('.ordered-books li h5').each(function() {
      $clamp(this, {clamp: 'auto'});
    });

    setTimeout(function() {
      setNewBackground(); //color chief for index
    }, 300);
  }

  function deleteFromQueueOnServer(index) {
    $.post('/api/books/delete-from-queue', {bookId: index}, function() {
      getQueue(redrawOrderedListInHtml); 
    });
  }

  function findUnorderedIds() {
    unorderedIds = [];
    $(".unordered-books li").each(function() {
      var value = $(this).find('input').val();
      unorderedIds.push(parseInt(value));
    });
    return unorderedIds;
  }

  function findOrderedIds() {
    orderedIds = [];
    $(".ordered-books li").each(function() {
      var value = $(this).find('input').val();
      orderedIds.push(parseInt(value));
    });
    return orderedIds;
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
  }

  // setHeight();
  function setTextColor(array, container) {
    var colorNumber = array[0] + array[1] + array[2];
    if (colorNumber > 300) {
      $(container).addClass('colorBl');
    }
    else if (colorNumber <= 300) {
      $(container).addClass('colorWh');
    }
  }

})(); //end of main function