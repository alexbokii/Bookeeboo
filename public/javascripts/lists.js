$(document).ready(function() {
  var orderedBooks = [];
  var unorderedBooks = [];
  var orderedIds = [];
  var currentSearch;
  var currentBook;

  function findOrderedIds() {
    orderedIds = [];
      $(".ordered-books li").each(function() {
        var value = $(this).find('input').val();
        orderedIds.push(parseInt(value));
      });
  }

  //0. Prepare DOM
  $('#search-delete').hide();

  //1. Ajax for unordered list
  // We receive array with unordered books here
  $.ajax('/api/books/unordered',  {
    success: function(response) {
      response.forEach (function (book, index) {
        unorderedBooks.push(book);
        createUnorderedBook(book);
      });
      console.log(unorderedBooks);
    },
    error: function(request, errorType, errorMessage) {
      console.log("Error: " + errorType + " with message: " + errorMessage);
    }
  });

  function createUnorderedBook(item) {
    $(".unordered-books ul").prepend("<li>"
          +"<input type='hidden' value='" + item.id + "' />"
          +"<img src='" + item.imageUrl + "'>"
          +"</li>");
  }

  //2. Ordered list
  // We receive array with ordered books here
  $.ajax('/api/books/queue', {
    success: function(response) {
      response.forEach (function (book, index) {
        orderedBooks.push(book);
      })
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
    var index = 0;
    for (var i = 0; i < array.length; i++) {
      $(".ordered-books ul").append("<li>"
          + "<input type='hidden' value='" + array[i].id + "' />"
          + "<img src='" + array[i].imageUrl + "'/>"
          + "<h5>" + array[i].title + "</h5>"
          + "<div class='index'>" + (index+1) + "</div>"
          + "</li>");
      index++;
    }
    setNewCurrentBook(); // set current book
    setTimeout(function() {
        setNewBackground();
      }, 300);
  }

  //3. Current book
  // Current book is the first book from ordered-books list. Every time 1-st book is changed, 
  // current book is changes and slider as well
  function setNewCurrentBook() {
    currentBook = orderedBooks[0];
    $(".current-reading .cover").css('background', 'url(' + currentBook.imageUrl + ') no-repeat');
    $(".current-reading .cur-header h3").html(currentBook.title);
    $(".current-reading .cur-header num-of-pages").html(currentBook.pageCount);
    $(".current-reading .details p").html(currentBook.description);
    $(".current-reading .last-page").html(currentBook.pageCount);
    setNewSliderForNewCurrentBook(currentBook); 
  }

  //4. Page count, slider for current page
  // Settings for slider and for change-number buttons 
  function setNewSliderForNewCurrentBook(currentBook) {
    updateSliderInfo({max: currentBook.pageCount, val: currentBook.currentPage});

    var position = currentBook.currentPage / (currentBook.pageCount / 100);
    $(".page-counter").css({"left": ""+ position + "%"});
    $(".page-counter").html(currentBook.currentPage);
    $(".ui-slider-handle").css({"left": ""+ position + "%"});
  }

  $( ".slider" ).slider({
    range: "min",
    min: 1,
    slide: function( event, ui ) {
      $(".page-counter").show();
      $(".page-counter").text(ui.value);
      currentBook.currentPage = ui.value;  //send to local object
      orderedBooks[0].currentPage = ui.value; // send to local array-ord-list
      $.post('/api/books/page', {bookId: currentBook.id, page: ui.value}); //send to server
      changeCounterPosition();
    }
  });

  function changeCounterPosition () {
    var sliderPosition = parseFloat($(".ui-slider-handle").css('left'));
    $(".page-counter").css({"left": ""+ sliderPosition + "px"});
  }

  function updateSliderInfo (params) {
    $('.slider').slider('option', 'max', params.max);
    $('.slider').slider('value', params.val);
  }

  $("li.number").on("click", changeCounterNumber);

  function changeCounterNumber() {
    var operator = $(this).closest("ul");
    var changingNumber= $(this).text();
    changingNumber = parseFloat(changingNumber);

    if (operator.hasClass("minus")) {
      var result = currentBook.currentPage - changingNumber;
      if (result <= 0) {
        return;
      }
    }
    else if (operator.hasClass("plus")) {
      var result = currentBook.currentPage + changingNumber;
      if (result > currentBook.pageCount) {
        return;
      }
    }

    currentBook.currentPage = result; //send new value to local current object
    orderedBooks[0].currentPage = result; //send new value to local array os ordered books
    $.post('/api/books/page', {bookId: currentBook.id, page: result}); //send to server

    $(".slider").slider("value", currentBook.currentPage);
    $(".page-counter").text($(".slider").slider("value"));

    changeCounterPosition();
  }


  //5. Color thief for ordered list
  // Here we receive main color from book cover and set it as bg-color for index's div
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

  //6. Height of h5 in ordered list
  // Every li has own extra height for title. Count this height and the height of title here.
  function setHeight() {
    $(".ordered-books li").each(function() {
      var h5 = $(this).find("h5")[0];
      var img = $(this).find("img")[0];

      var h5Height = $(h5).height();
      var imgHeight = $(img).height();

      var result = 250 - imgHeight - 24 - 20;
      $(h5).height(result);
    });
  } 

  //7. Sortable for ordered list
  // Sort ordered list, call func-s for setting new order to local array and on server
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
      findOrderedIds();
      changeIndexesAfterChangingOrder();
      setNewOrderOfOrderedBooks(orderedIds);
      sendOrderOfOrderedToServer(orderedIds);
      setNewCurrentBook();
    }
  });

  //8. Change order of ordered-books in our array and on server
  function setNewOrderOfOrderedBooks(orderedIds) {
    var newOrderedBooks = [];
    for(i = 0; i < orderedIds.length; i++) {
      for(var j = 0; j < orderedBooks.length; j++) {
        if (orderedIds[i] === orderedBooks[j].id) {
          newOrderedBooks.push(orderedBooks[j]);
        }
      }
    }
    orderedBooks = newOrderedBooks;
  }

  function changeIndexesAfterChangingOrder() {
    var index = 1;
    $('.ordered-books li').each(function() {
      $(this).find('.index').html(index);
      index++;
    });
  }

  function sendOrderOfOrderedToServer(orderedIds) {
    $.post('/api/order/queue', {queue: orderedIds});
  }

  //9. Create delete button for every li
  //Every li have a button for deleating this li which appears on hover
  $(".ordered-books, .unordered-books").on({
    mouseenter: function() {
      $(this).append("<div class='sorting-delete'>x</div>");
    },
    mouseleave: function() {
      $(this).find('.sorting-delete').remove();
    }
  }, "li");

  //10. Delete book from ordered books list
  //On press button delete our book should be deleted from DOM, server and local array.
  //Other books should change their order
  $('.ordered-books').on('click', '.sorting-delete', function() {
    var deletingId = $(this).closest('li').find('input').val();
    deletingId = parseInt(deletingId);

    deleteBookFromOrderedBooksAndHtml(deletingId);
    deleteOrderedBookFromServer(deletingId); 
  });

  function deleteBookFromOrderedBooksAndHtml(deletingId) {
    findOrderedIds(); //because we need to have new order to build new html
    for(var i = 0; i < orderedIds.length; i++) {
      if(deletingId === orderedIds[i]) {
        for(var j = 0; j < orderedBooks.length; j++) {
          if(orderedBooks[j].hasOwnProperty("id") &&
            orderedBooks[j]["id"] === deletingId) {
            var deletingBook = j;
          }
        }
      } // end of 1-st if
    } // end of main for
    orderedBooks.splice(deletingBook, 1); // delete book object from our local array
    $('.ordered-books li').remove(); // to build new html from beginning, not to add
    WriteOrderedLIstInHtml(orderedBooks);
  }

  function deleteOrderedBookFromServer(index) {
    $.post('/api/books/delete-from-queue', {bookId: index});
  }

  //11. Delete from unordered books
  //When we press delete on unordered list choosed li deletes from html and server
  //We don't have local array for it, so we don't need any other actions
  $('.unordered-books').on('click', '.sorting-delete', function() {
    var deletingId = $(this).closest('li').find('input').val();
    deletingId = parseInt(deletingId);
    console.log(deletingId);

    deleteUnorderedBookFromHtml(deletingId);
    deleteUnorderedBookFromServer(deletingId); 
  });

  function deleteUnorderedBookFromHtml(deletingId) {
    $('.unordered-books li').each(function() {
      var deletedValue = $(this).find('input').val();
      deletedValue = parseInt(deletedValue);
      if(deletedValue === deletingId) {
        $(this).remove();
      }
    });
  }

  function deleteUnorderedBookFromServer(index) {
    $.post('/api/books/delete-from-unordered', {bookId: index});
  }

  //12. Search and add new book
  //12.1. Work with focus state in DOM
  var calcBrowserHeight = (function () {
    var height = window.innerHeight;
    $('.input-focus').css('height', '"' + height + '"');
    console.log(height);
  }()); //not the same in css because it has max height of relative container

  $(".input-field").focus(function() {
    $('#search-delete').show();
    $('.hidden-panel ul').addClass('input-focus');
  });

  $(".input-field").focusout(function() {
    $('.hidden-panel ul').removeClass('input-focus');
  });

  //12.2. Search of book and show it in DOM
  function removeOldSearch() {
    $('.hidden-panel ul li').each(function() {
      $(this).remove();
    });
  }

  var bookSearch = function() {
    removeOldSearch();
    var currentInput = $(".input-field").val();
    $.getJSON('/api/search?query=' +currentInput, getData);
  };

  function getData(searchResult) {
    var total = searchResult.total;
    currentSearch = searchResult.books;
    console.log(currentSearch);

    $.each(currentSearch, function(index, book) {
      $(".hidden-panel ul").append("<li>"
      + "<div class='book-cover' style='background-image: url(" + book.imageUrl + ");'></div>"
      + "<div class='book-description'>"
      + "<h2>" + book.title +"</h2>"
      + "<p>" + book.description +"</p>"
      + "</div>"
      + "<button class='add-book'>Add</button>"
      + "<div style='clear: both'></div>"
      + "<div class='separate-line'></div>"
      +"</li>");
    });
  }

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

  //12.3. Add new book from search to unordered list 
  $('.panel').on('click', '.add-book', function() {
    $(this).html("Added");
    $(this).css('color', '#DF5D45');
    var valueOfChoosen = $(this).closest('li').find('h2');
    valueOfChoosen = $(valueOfChoosen[0]).text();
    console.log(valueOfChoosen);

    for(var i = 0; i < currentSearch.length; i++) {
      if(valueOfChoosen == currentSearch[i].title) {
        console.log(currentSearch[i]);
        createUnorderedBook(currentSearch[i]);
        $.post('/api/books', {book: currentSearch[i]});
      }
    }
  });

  //12.4. Delete old search from DOM
  $('.search').on('click', '#search-delete', function() {
    $('#search-delete').hide();
    removeOldSearch();
    $('.input-field').val('');
  })



});