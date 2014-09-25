window.common = {
  orderedBooks: [],
  unorderedBooks: [],
  currentBook: {},
  buildBookHtml: function(array) {
    var index = 0;
    var htlmList = [];
    for (var i = 0; i < array.length; i++) {
      var htmlListItem = ("<li>"
        + "<input type='hidden' value='" + array[i].id + "' />"
        + "<img src='" + array[i].imageUrl + "'/>"
        + "<h5>" + array[i].title + "</h5>"
        + "<div class='index'>" + (index+1) + "</div>"
        + "</li>");
      htlmList.push(htmlListItem);
      index++;
    } // end of for
    return htlmList;
  }
}

$(document).ready(function() {
  //4. Page count, slider for current book
  // Settings for slider and for change-number buttons 
  function setNewSliderForNewCurrentBook(currentBook) {
    updateSliderInfo({max: currentBook.pageCount, val: currentBook.currentPage});

    var position = currentBook.currentPage / (currentBook.pageCount / 100);
    $(".page-counter").css({"left": ""+ position + "%"});
    $(".ui-slider-handle").css({"left": ""+ position + "%"});

    if (currentBook.currentPage > 0) {
      $(".page-counter").html(currentBook.currentPage);
    }
    else {
      $(".page-counter").html("");
    }
  }

  $(".slider").slider({
    range: "min",
    min: 1,
    slide: function( event, ui ) {
      $(".page-counter").show();
      $(".page-counter").text(ui.value);
      currentBook.currentPage = ui.value;  //send to local object
      // orderedBooks[0].currentPage = ui.value; // send to local array-ord-list
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
    // orderedBooks[0].currentPage = result; //send new value to local array os ordered books
    $.post('/api/books/page', {bookId: currentBook.id, page: result}); //send to server

    $(".slider").slider("value", currentBook.currentPage);
    $(".page-counter").text($(".slider").slider("value"));

    changeCounterPosition();
  }


});