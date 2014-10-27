(function() {
  var currentReading;

  var currentBook = bookeeboo.currentBook = {
    init: function() {
      $(".slider").slider({
        range: "min",
        min: 1,
        slide: onSlide
      });

      $("li.number").on("click", function() {
        var newPage = calculateNewCurrentPage($(this));
        updateCurrentPage(newPage);
      });
    },

    setNewCurrentBook: function(book) {
      if(book) {
        currentReading = book;
        showCurrentBookInHtml(currentReading);
        setNewSliderForNewCurrentBook(currentReading); 
      }
      else {
        showCurrentBookSectionWhenCurrentBookIsMissing();
      }
    }
  };

  function onSlide(event, ui) {
    $(".page-counter").show();
    $(".page-counter").text(ui.value);
    
    currentReading.currentPage = ui.value;

    $.post('/api/books/page', {bookId: currentReading.id, page: ui.value}); //send to server
    updatePageCounterPosition(currentReading);
  }

  function showCurrentBookSectionWhenCurrentBookIsMissing() {
    $('.current-reading h3, .current-reading .details p').html('');
    $('.current-reading .cover').css('background', 'none');
    $('.pages').hide();
    $('.current-reading').append("<p class='empty'>Use search th the top of the page o add books to your queue.</p>");
  }

  function showCurrentBookInHtml(currentReading) {
    $('.pages').show();
    $('.current-reading p.empty').remove();
    $(".current-reading .cover").css('background', 'url(' + currentReading.imageUrl + ') no-repeat');
    $(".current-reading .cur-header h3").html(currentReading.title + "<span>" + currentReading.pageCount + " pages</span>");
    $(".current-reading .details p").html(currentReading.description ? currentReading.description : "No description");
    $(".current-reading .last-page").html(currentReading.pageCount);
  }

  function setNewSliderForNewCurrentBook(currentReading) {
    updateSliderInfo({max: currentReading.pageCount, val: currentReading.currentPage});
    updatePageCounterPosition(currentReading);
  }

  function updateSliderInfo (params) {
    $('.slider').slider('option', 'max', params.max);
    $('.slider').slider('value', params.val);
  }

  function updatePageCounterPosition(currentReading) {
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
        result = 1;
      }
    }
    else if (operator.hasClass("plus")) {
      result = currentReading.currentPage + changingNumber;
      if (result > currentReading.pageCount) {
        result = currentReading.pageCount;
      }
    }
  
    return result;
  }

  function updateCurrentPage(newPage) {
    currentReading.currentPage = newPage; 

    updateSliderInfo({max: currentReading.pageCount, val: currentReading.currentPage});

    updatePageCounterPosition(currentReading);

    $.post('/api/books/page', {bookId: currentReading.id, page: currentReading.currentPage});
  }
})();