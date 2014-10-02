(function() {
  var unorderedBooksArray = [];
  var currentSearch = [];
  var searchPageCounter = 1;
  var searchInProgress = false;
  var timerID;

  var unorderedBooks = bookeeboo.unorderedBooks = {
    init: function() {
      searchDeleteSign(false);
      getUnorderedList();

      $(".unordered-books").on({
        mouseenter: function() {$(this).append("<div class='sorting-delete'>x</div>");},
        mouseleave: function() {$(this).find('.sorting-delete').remove();}
      }, "li");

      $('.unordered-books').on('click', '.sorting-delete', function() {
        var el = $(this).closest('li');
        var id = el.find('input').val();
        deleteUnorderedBookFromServer(id);
      });

      $( ".unordered-books ul" ).sortable({connectWith: ".connectedSortable"}).disableSelection();

      $(".input-field").keyup(function() {
        resetPreviousSearch();
        clearInterval(timerID);
        timerID = setTimeout(bookSearch, 300);
      });

      $(".input-field").keypress(function(e) {
        if(e.which == 13) {
          resetPreviousSearch();
          bookSearch();
        }
      });

      $('.panel').on('click', '.add-book', function() {
        if ($(".unordered-books li").length > 5) {
          unsuccessfulAddingOfBook();
        } 
        else {
          successfulAddingOfBook($(this));
        }
      });

      $(".input-field").focus(function() {
        searchDeleteSign(true);
      });

      $(".input-field").focusout(function() {
        if ($(".hidden-panel ul li").length === 0) {
          searchDeleteSign(false);
        } 
    });

    $('.search').on('click', "#search-delete", function() {
      $('.hidden-panel ul').empty();
      $('.hidden-panel p').remove();
      $('.input-field').val('');
      searchDeleteSign(false);
    });

    $('.hidden-panel').scroll(function() {
      loadMoreOnScroll();
    });
  }
};

  function searchDeleteSign(isVisible) {
    if (isVisible === true) {
      $('#search-delete').show();
    }
    else {
      $('#search-delete').hide();
    }
  }

  function getUnorderedList() {
    $.ajax('/api/books/unordered', {
      success: function(response) {
        unorderedBooksArray = response;
        var htmlUnordered = common.buildBookHtml(unorderedBooksArray);
        rewriteOrederOfUnorderedBooks(htmlUnordered);
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

  function bookSearch() {
    var currentInput = $(".input-field").val();
    $.getJSON('/api/search?query=' + currentInput + '&page=' + searchPageCounter, arrangeData);
  }

  function arrangeData(searchResult) {
    searchInProgress = false;
    if (searchResult.total == 0) {
      $(".hidden-panel").append("<p>Unfortunately, no results matched</p>");
    }
    else {
      currentSearch = searchResult.books;
      showSearchResult(currentSearch);
    } 
  }

  function resetPreviousSearch() {
    currentSearch = [];
    $('.hidden-panel ul').empty();
  }

  function showSearchResult(currentSearch) {
    $.each(currentSearch, function(index, book) {
    var newEl = "<li>"
      + "<div class='book-cover' style='background-image: url(" + book.imageUrl + ");'></div>"
      + "<div class='book-description'>"
      + "<h2>" + book.title +"</h2>"
      + "<p>" + book.description +"</p>"
      + "</div>"
      + "<button class='add-book'>Add</button>"
      + "<div style='clear: both'></div>"
      + "<div class='separate-line'></div>"
      +"</li>";
      $(".hidden-panel ul").append(newEl);
    });
  }

  function successfulAddingOfBook(el) {
    $(el).html("Added");
    $(el).css('color', '#DF5D45');
    var choosedBook = $(el).closest('li').find('h2');
    choosedBook = $(choosedBook[0]).text();
    console.log(choosedBook);

    for(var i = 0; i < currentSearch.length; i++) {
      if(choosedBook == currentSearch[i].title) {
        console.log(currentSearch[i]);
        $.post('/api/books', {book: currentSearch[i]}, function() {
          getUnorderedList();
        });
      }
    }
  }

  function unsuccessfulAddingOfBook() {
    alert("You can't add new book. Max quantity of books without order - 6");
    searchDeleteSign(false);
    $('.hidden-panel ul').empty();
    $('.input-field').val('');
    $('html, body').animate({
      scrollTop: $(".unordered-books").offset().top
    }, 300);
  }

  function loadMoreOnScroll() {
    if (searchInProgress) {
      return
    }

    else if ($('.hidden-panel').scrollTop() == $('.hidden-panel')[0].scrollHeight - $(window).height()) {
      console.log("Next loading");
      searchInProgress = true;
      scrolledToTheEnd();
    }
  }

  function scrolledToTheEnd() {
    searchPageCounter++;
    bookSearch();
  };

})(); // end of main function

  