(function() {
  var currentReading;

  var currentBook = bookeeboo.currentBook = {
    init: function() {
      $(".slider").slider({
        range: "min",
        min: 1,
        slide: function( event, ui ) {
        $(".page-counter").show();
        $(".page-counter").text(ui.value);
        currentReading.currentPage = ui.value;

        $.post('/api/books/page', {bookId: currentReading.id, page: ui.value}); //send to server
          updatePageCounterPosition();
        }
      });

      $("li.number").on("click", function() {
        calculateNewCurrentPage($(this));
      });
    },

    setNewCurrentBook: function(book) {
      if(book) {
        currentReading = book;
        existenceOfCurrentBook(true);
        showCurrentBookInHtml(currentReading);
        setNewSliderForNewCurrentBook(currentReading); 
      }
      else {
        existenceOfCurrentBook(false);
      }
    }
  };

  function existenceOfCurrentBook(arg) {
    if(arg == true) {
      $('.pages').show();
      $('.current-reading p.empty').remove();
    }
    if(arg == false) {
      $('.current-reading h3, .current-reading .details p').html('');
      $('.current-reading .cover').css('background', 'none');
      $('.pages').hide();
      $('.current-reading').append("<p class='empty'>Use search th the top of the page o add books to your queue.</p>");
    }
  }

  function showCurrentBookInHtml(currentReading) {
    $(".current-reading .cover").css('background', 'url(' + currentReading.imageUrl + ') no-repeat');
    $(".current-reading .cur-header h3").html(currentReading.title + "<span>" + currentReading.pageCount + " pages</span>");
    $(".current-reading .details p").html(currentReading.description ? currentReading.description : "No description");
    $(".current-reading .last-page").html(currentReading.pageCount);
  }

  function setNewSliderForNewCurrentBook(currentReading) {
    updateSliderInfo({max: currentReading.pageCount, val: currentReading.currentPage});
    updatePageCounterPosition();
  }

  function updateSliderInfo (params) {
    $('.slider').slider('option', 'max', params.max);
    $('.slider').slider('value', params.val);
  }

  function updatePageCounterPosition() {
    if (currentReading.currentPage <= 0) {
      $(".page-counter").html("");
    }
    else {
      $(".page-counter").html(currentReading.currentPage);
      var sliderPosition = parseFloat($(".ui-slider-handle").css('left'));
      $(".page-counter").css({"left": ""+ sliderPosition + "px"});
    }
  }

  // changing current page with buttons
  function calculateNewCurrentPage(el) {
    var operator = el.closest("ul");
    var changingNumber = parseFloat(el.text());

    var result;
    if (operator.hasClass("minus")) {
      result = currentReading.currentPage - changingNumber;
      if (result <= 0) {
        return;
      }
    }
    else if (operator.hasClass("plus")) {
      result = currentReading.currentPage + changingNumber;
      if (result > currentReading.pageCount) {
        return;
      }
    }
  
    updateCurrentPage(result);
  }

  function updateCurrentPage(newPage) {
    currentReading.currentPage = newPage; 

    updateSliderInfo({max: currentReading.pageCount, val: currentReading.currentPage});

    updatePageCounterPosition();

    $.post('/api/books/page', {bookId: currentReading.id, page: currentReading.currentPage});
  }
})();