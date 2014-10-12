(function() {
  var unorderedBooksArray = [];
  var currentSearch = [];
  var searchPageCounter = 1;
  var searchInProgress = false;
  var timerID;

  var unorderedBooks = bookeeboo.unorderedBooks = {
    init: function() {
      // showSearchCloseIcon(false);
      getUnorderedList();

      $(".unordered-books").on({
        mouseenter: function() {$(this).append("<div class='sorting-delete'></div>");},
        mouseleave: function() {$(this).find('.sorting-delete').remove();}
      }, "li");

      $('.unordered-books').on('click', '.sorting-delete', function() {
        var el = $(this).closest('li');
        var id = el.find('input').val();
        deleteUnorderedBookFromServer(id);
      });

      $( ".unordered-books ul" ).sortable(sortingUnorderedBooks).disableSelection();
    },

    populateUnorderedListFromServer: getUnorderedList,

    isUnorderedBooksFull: function() {
      var isFull = $('.unordered-books li').length === 6;
      return isFull;
    }
  };

  var sortingUnorderedBooks = {
    connectWith: ".connectedSortable",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
    }
  };

  function getUnorderedList(callback) {
    $.ajax('/api/books/unordered', {
      success: function(response) {
        unorderedBooksArray = response;
        var htmlUnordered = common.buildBookHtml(unorderedBooksArray);
        rewriteOrederOfUnorderedBooks(htmlUnordered);
        
        if (callback) {
          callback();  
        }
      },
      error: function(request, errorType, errorMessage) {
        console.log("Error: " + errorType + " with message: " + errorMessage);
      }
    });
  }

  function rewriteOrederOfUnorderedBooks(list) {
    $(".unordered-books ul").empty();
    $(".unordered-books ul").append(list);
    $(".unordered-books ul li h5, .unordered-books ul li .index").hide();
  }

  function deleteUnorderedBookFromServer(index) {
    $.post('/api/books/delete-from-unordered', {bookId: index}, function() {
      getUnorderedList();
    });
  }


})(); // end of main function

  