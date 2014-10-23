(function() {
  var timerID;
  var searchPage = 1;
  var isLoadOnScrollEnabled = true;
  var foundBooks = [];

  var search = bookeeboo.search = {
    init: function() {
      $('.input-field').keyup(onKeyUp);

      isSearchResetButtonVisible(false);
      $('button#search-delete').on('click', resetSearch);

      $('.hidden-panel').scroll(onSearchScroll);

      $('.hidden-panel').on('click', 'button.add-book', addBookToUnordered);
    }
  }; // end of search object

  function onKeyUp() {
    searchPage = 1;

    isSearchResetButtonVisible(searchInputHasText());

    visibleLoadingSpinner(true);

    if(!searchInputHasText()) {
      resetSearch();
      return;
    }

    wait(function() {
      var input = $('.input-field').val();
      getJSONFromServer(input, searchPage, getAndShowResultsOnPage);
    });
  }

  function getJSONFromServer(input, page, callback) {
    $.getJSON('/api/search?query=' + input + '&page=' + page, callback);
  }

  function wait(callback) {
    clearInterval(timerID);

    timerID = setTimeout(function() {
      callback();
    }, 500);
  }

  function getAndShowResultsOnPage(result) {  
    visibleLoadingSpinner(false);

    if(result.books.length === 0 && searchInputHasText()) {
      $('.hidden-panel ul').html("<li class='no-result'><p>Unfortunately, no results matched</p></li>");
      return;
    }
    if(searchInputHasText()) {
      var resultHTML = result.books.map(mapJSONToHTML);
      if (searchPage === 1) {
        $('.hidden-panel ul').html(resultHTML);

        foundBooks = result.books;
      }
      else {
        $('.hidden-panel ul').append(resultHTML);

        result.books.forEach(function(book) {
          foundBooks.push(book);
        });
      }
    }
  }

  function mapJSONToHTML(bookJSON) {
    var description = bookJSON.description;
      if (!bookJSON.description) {
        description = "No description";
      }
    var buttonText = "Add";
      if(bookeeboo.unorderedBooks.isUnorderedBooksFull()) {
        buttonText = "Clear your unordered books before adding new";
        var buttonClass = 'not-added';
      }

      var bookHTML = "<li>"
        + "<div class='book-cover' style='background-image: url(" + bookJSON.imageUrl + ");'></div>"
        + "<div class='book-description'>"
        + "<h2>" + bookJSON.title +"</h2>"
        + "<p>" + description +"</p>"
        + "</div>"
        + "<button class='add-book " + buttonClass + "'>" + buttonText + "</button>"
        + "<div style='clear: both'></div>"
        + "<div class='separate-line'></div>"
        + "</li>";

      return bookHTML;
  }

  function resetSearch() {
    $('.hidden-panel ul').empty();
    $('.input-field').val("");
    isSearchResetButtonVisible(false);
    visibleLoadingSpinner(false);
  }

  function isSearchResetButtonVisible(visible) {
    if (visible) {
      $('button#search-delete').show();
    }
    else {
      $('button#search-delete').hide();
    }
  }

  function searchInputHasText() {
    return ($('.input-field').val() != '');
  }

  // scroll
  function onSearchScroll() {
    if (!isLoadOnScrollEnabled) {
      return;
    }

    var currentScrollPosition = $('.hidden-panel').scrollTop();
    var scrollTotalHeight = $('.hidden-panel')[0].scrollHeight;
    var windowHeight = $(window).height();
    var isPassed70PercentOfScroll =  (currentScrollPosition + windowHeight) > (scrollTotalHeight * 0.7);
    
    if(isPassed70PercentOfScroll) {
      var input = $('.input-field').val();
      
      isLoadOnScrollEnabled = false;
      searchPage++;

      getJSONFromServer(input, searchPage, function(result) {
        isLoadOnScrollEnabled = true;
        getAndShowResultsOnPage(result);
      });
    }
  }

  // add book 
  function addBookToUnordered() {
    if(!bookeeboo.unorderedBooks.isUnorderedBooksFull()) {
      var index = $(this).closest('li').index();
      var book = foundBooks[index];
      markBookAsAdded($(this));

      $.post('/api/books', {book: book}, function() {
        bookeeboo.unorderedBooks.populateUnorderedListFromServer(changeAddButtonsIfUnorderedListIsFull);
      });
    }
  }

  function markBookAsAdded(el) {
    el.addClass('added').removeClass('not-added').html('Added');
  }

  function changeAddButtonsIfUnorderedListIsFull() {
    if(bookeeboo.unorderedBooks.isUnorderedBooksFull()) {
      $('button.add-book:not(.added)').html('Clear your unordered books before adding new');
      $('button.add-book').addClass('not-added');
    }
  }

  function visibleLoadingSpinner(visible) {
    if (visible) {
      $('#loading-spinner').css('visibility', 'visible');
    }
    else {
      $('#loading-spinner').css('visibility', 'hidden');
    }
  }

})(); // end of main function
