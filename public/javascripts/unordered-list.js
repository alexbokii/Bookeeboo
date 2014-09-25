$(document).ready(function() {
  var currentSearch = [];

  function searchDeleteSign(isVisible) {
    if (isVisible === true) {
      $('#search-delete').show();
    }
    else {
      $('#search-delete').hide();
    }
  };

  searchDeleteSign(false);

  //1. Receive unordered list from server
  var getUnorderedList = function() {
    $.ajax('/api/books/unordered',  {
      success: function(response) {
        window.common.unorderedBooks = response;
        var htmlUnordered = window.common.buildBookHtml(window.common.unorderedBooks);
        rewriteOrederOfUnorderedBooks(htmlUnordered);
      },
      error: function(request, errorType, errorMessage) {
        console.log("Error: " + errorType + " with message: " + errorMessage);
      }
    });
  };

  getUnorderedList();

  function rewriteOrederOfUnorderedBooks(list) {
    $(".unordered-books ul").empty();
    $(".unordered-books ul").append(list);
    $(".unordered-books ul li h5, .unordered-books ul li .index").hide();
  }

  //Create delete button
  $(".unordered-books").on({
    mouseenter: function() {
      $(this).append("<div class='sorting-delete'>x</div>");
    },
    mouseleave: function() {
      $(this).find('.sorting-delete').remove();
    }
  }, "li");

  // Delete book
  $('.unordered-books').on('click', '.sorting-delete', function() {
    var el = $(this).closest('li');
    var id = el.find('input').val();
    
    window.common.deleteUnorderedBookFromServer(id);

    setTimeout(function() {
      getUnorderedList(); // setTimeOut because of parallel functions
    }, 100);
  });

  // Search
  var timerID;
  $(".input-field").keyup(function() {
    clearInterval(timerID);
    timerID = setTimeout(bookSearch, 300);
  });

  $(".input-field").keypress(function(e) {
    if(e.which == 13) {
      bookSearch;
    }
  }); 

  var bookSearch = function() {
    currentSearch = [];
    var currentInput = $(".input-field").val();
    $.getJSON('/api/search?query=' + currentInput, arrangeData);
  };

  function arrangeData(searchResult) {
    console.log(searchResult);

    if (searchResult.total == 0) {
      $(".hidden-panel").html("Unfortunately, no results matched");
    }

    currentSearch = searchResult.books;
    showSearchResult(currentSearch);
  }

  function showSearchResult(currentSearch) {
    $('.hidden-panel ul').empty();
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

  $('.panel').on('click', '.add-book', function() {
    if ($(".unordered-books li").length >= 5) {
      unsuccessfulAddingOfBook();
    } 
    else {
      successfulAddingOfBook($(this));
    }
  });

  function successfulAddingOfBook(el) {
    $(el).html("Added");
    $(el).css('color', '#DF5D45');
    var choosedBook = $(el).closest('li').find('h2');
    choosedBook = $(choosedBook[0]).text();
    console.log(choosedBook);

    for(var i = 0; i < currentSearch.length; i++) {
      if(choosedBook == currentSearch[i].title) {
        console.log(currentSearch[i]);
        $.post('/api/books', {book: currentSearch[i]});
        getUnorderedList();
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

  $(".input-field").focus(function() {
    searchDeleteSign(true);
  });

  $(".input-field").focusout(function() {
    if ($(".hidden-panel ul li").length === 0) {
      searchDeleteSign(false);
    } 
  });

  $('.search').on('click', '#search-delete', function() {
    searchDeleteSign(false);
    $('.hidden-panel ul').empty();
    $('.input-field').val('');
  })
  
}); // end of ready