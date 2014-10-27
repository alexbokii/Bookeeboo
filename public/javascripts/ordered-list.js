(function() {
  var orderedBooksArray = [];

  var orderedBooks = bookeeboo.orderedBooks = {
    init: function() {
      receiveQueueFromServer(redrawOrderedListInHtml);

      $(".ordered-books ul").sortable(sortingOrderedBooks);

      $(".ordered-books").on({
        mouseenter: function() {$(this).append("<div class='sorting-delete'></div>");},
        mouseleave: function() {$(this).find('.sorting-delete').remove();}
      }, "li:not('.empty')");

      $('.ordered-books').on('click', '.sorting-delete', deleteOrderedBook);
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
      
      sendNewOrderToServer(orderedIds);
      updateOrderedBooksIndexes();  
    },
    receive: function( event, ui ) {
      var unorderedIds = bookeeboo.unorderedBooks.findUnorderedIds();
      bookeeboo.unorderedBooks.sendUnorderedIdsOrderToServer(unorderedIds);

      var orderedIds = findOrderedIds();
      $.post('/api/order/queue', {queue: orderedIds}, function() {
        receiveQueueFromServer(redrawOrderedListInHtml);
      });
    }
  };

  function deleteOrderedBook() {
    var el = $(this).closest('li');
    var id = el.find('input').val();
    
    deleteFromQueueOnServer(id, function() {
      receiveQueueFromServer(redrawOrderedListInHtml);
    });
  }

  function updateOrderedBooksIndexes() {
    $('.ordered-books li').each(function(index) {
      $(this).find('.index').html(index + 1);
    });
  }

  function receiveQueueFromServer(successCallback) {
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

  function sendNewOrderToServer(orderedIds) {
    $.post('/api/order/queue', {queue: orderedIds}, receiveQueueFromServer);
  }

  function rewriteOrderOfOrderedBooks(list) {
    $(".ordered-books ul").empty();
    $(".ordered-books p.empty").remove();

    if(list.length === 0) {
      $(".ordered-books").append('<p class="empty">Nothing in your reading queue. Add your books and start reading.</p> ');
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

  function deleteFromQueueOnServer(index, callback) {
    $.post('/api/books/delete-from-queue', {bookId: index}, callback);
  }

  function findOrderedIds() {
    orderedIds = [];
    $(".ordered-books li").each(function() {
      var value = $(this).find('input').val();
      orderedIds.push(parseInt(value));
    });
    return orderedIds;
  }

  //Set bg-color and font-color for div with index
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

  function setTextColor(array, container) {
    var colorNumber = array[0] + array[1] + array[2];
    if (colorNumber > 300) {
      $(container).addClass('colorBl');
    }
    else {
      $(container).addClass('colorWh');
    }
  }

})(); //end of main function