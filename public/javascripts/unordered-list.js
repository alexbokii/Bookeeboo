(function() {
  var unorderedBooksArray = [];

  var unorderedBooks = bookeeboo.unorderedBooks = {
    init: function() {
      getUnorderedList();

      $(".unordered-books").on({
        mouseenter: function() {$(this).append("<div class='sorting-delete'></div>");},
        mouseleave: function() {$(this).find('.sorting-delete').remove();}
      }, "li:not('.empty')");

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
    placeholder: "sortable-placeholder",
    start: function( event, ui ) {
      $(".ordered-books").addClass("start-sorting");
    },
    stop: function( event, ui ) {
      $(".ordered-books").removeClass("start-sorting");
      updateNumberOfUnorderedBooks();
      checkIfUnorderedSectionEmpty();
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

  function updateNumberOfUnorderedBooks() {
    var unorderedLength = $('.unordered-books li').length;
    $('.booksnumber-keeper span').html(unorderedLength);
  }

  function rewriteOrederOfUnorderedBooks(list) {
    $(".unordered-wrapper .empty").remove();
    $(".unordered-books ul").empty();

    $(".unordered-books ul").append(list);
    $(".unordered-books ul li h5, .unordered-books ul li .index").hide();

    updateNumberOfUnorderedBooks();

    checkIfUnorderedSectionEmpty();
  }

  function deleteUnorderedBookFromServer(index) {
    $.post('/api/books/delete-from-unordered', {bookId: index}, function() {
      getUnorderedList();
    });
  }

  function checkIfUnorderedSectionEmpty() {
    var numberOfItems = $('.unordered-books li').length;
    if(numberOfItems === 0) {
      $('.unordered-wrapper').append('<p class="empty">Nothing here</p>');
    }
  }

})(); // end of main function

  