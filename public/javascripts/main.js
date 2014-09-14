$(document).ready(function() {

	// //1. Ajax for unordered list
	// $.ajax('/api/books/unordered', {
	// 	success: function(response) {
	// 		response.forEach (function (book, index) {
	// 			$(".unordered-books ul").append("<li><img src='" + book.imageUrl + "'></li>");
	// 		});
	// 	},
	// 	error: function(request, errorType, errorMessage) {
	// 		console.log("Error: " + errorType + " with message: " + errorMessage);
	// 	}
	// });

	//2. Ajax for current book
  var book = {autor: "Alex Bokii", title: "CSS today", pageCount: 322};
  $(".last-page").html(book.pageCount);
  $(".page-counter").hide();
  var pageCounter = 0;

  $(function() {
      var sliderOptions = {
        range: "min",
        value: 0,
        min: 1,
        max: book.pageCount,
        slide: function( event, ui ) {
          $(".page-counter").show();
          $( ".page-counter" ).text(ui.value );
          pageCounter = ui.value;
          changeCounterPosition();
        }
      };

      $( ".slider" ).slider(sliderOptions);
    });

  function changeCounterPosition () {
    var sliderPosition = parseFloat($(".ui-slider-handle").css('left'));
    $(".page-counter").css({"left": ""+ sliderPosition + "px"});
    console.log(pageCounter);
  }

  $("li.number").on("click", changeCounterNumber);
  function changeCounterNumber() {
    var operator = $(this).closest("ul");
    var changingNumber= $(this).text();
    changingNumber = parseFloat(changingNumber);

    if (operator.hasClass("minus")) {
      var result = pageCounter - changingNumber;
      if (result <= 0) {
        return;
      }
    }
    else if (operator.hasClass("plus")) {
      var result = pageCounter + changingNumber;
      if (result > book.pageCount) {
        return;
      }
    }
    pageCounter = result;
   
    $( ".slider" ).slider( "value", pageCounter );
    $(".page-counter").show();
    $( ".page-counter" ).text($( ".slider" ).slider( "value" ));
    changeCounterPosition();
  }

  //3. Bang effect
  $(".page-keeper, .unordered-line").hide();
  $(".unordered-books button").on('click', function() {
    var c = $("ul li").length;
    if ( $( ".unordered-wrapper" ).is( ":hidden" ) ) {
      $( ".unordered-wrapper" ).slideDown(700, "easeOutQuint");
      $(".page-keeper, .unordered-line").slideUp();
      $(".unordered-books").removeClass("hidden-height");
    } 
    else {
      $( ".unordered-wrapper" ).slideUp(900, "easeInOutQuint", function() {
        $(".unordered-books").addClass("hidden-height");
        // $("button.up").after("<div class='unordered-line'></div>");
        // $("button.up").after("<div class='page-keeper'>" + pageCounter + "</div>");
        $(".page-keeper, .unordered-line").slideDown();
      });
    }
  });

  // //4. Ordered list
  // $.ajax('/api/books/queue', {
  //   success: function(response) {
  //     response.forEach (function (book, index) {
  //       $(".ordered-books ul").append("<li><input type='hidden' value='" + book.id + "' /><div class='ordered-wrapper'><img src='" + book.imageUrl + "'/><h5>" + book.title + "</h5><div class='index'>" + (index+1) + "</div></div></li>");
  //     });
  //     setTimeout(function() {
  //       setNewBackground();
  //     }, 300);
  //   },
  //   error: function(request, errorType, errorMessage) {
  //     console.log("Error: " + errorType + " with message: " + errorMessage);
  //   }
  // });

  // //5. Color thief for ordered list
  // function setNewBackground() {
  // $(".ordered-books li").each(function() {
  //   var myImage = $(this).find("img")[0];
  //   var indexContainer = $(this).find(".index")[0];

  //   var colorThief = new ColorThief();
  //   var color = colorThief.getColor(myImage);
  //   $(this).find(".index").css('backgroundColor', "rgb(" + color + ")");
  
  //   setTextColor(color, indexContainer);
  //   });
  // setHeight();
  // }

  // function setTextColor(array, container) {
  //   var colorNumber = array[0] + array[1] + array[2];
  //   if (colorNumber > 300) {
  //     $(container).addClass('colorBl');
  //   }
  //   else if (colorNumber <= 300) {
  //     $(container).addClass('colorWh');
  //   }
  // }

  // //6. Height of h5 in ordered list
  // function setHeight() {
  //   $(".ordered-books li").each(function() {
  //     var h5 = $(this).find("h5")[0];
  //     var img = $(this).find("img")[0];

  //     var h5Height = $(h5).height();
  //     var imgHeight = $(img).height();

  //     var result = 250 - imgHeight - 24 - 20;
  //     $(h5).height(result);
  //     console.log(imgHeight, result);
  //   });
  // } 

  // //7. Sortable for ordered list
  // $('.unordered-books ul').sortable({connectWith: '.ordered-books ul', tolerance: "pointer", placeholder: "hello",
  //   start: function(e, ui) { console.log(ui.placeholder); ui.placeholder.html("<div style='width: 10px; height: 10px; background-color: red'></div>") }
  // });
  // $(".ordered-books ul").sortable({ cursor: "move", revert: 200, tolerance: "pointer"});

  //8. Search for serach-input
  var bookSearch = function() {
    var currentInput = $(".input-field").val();
    console.log(currentInput);
    $.getJSON('/api/search?query=' +currentInput, getData);
  };

  function getData(searchResult) {
      var total = searchResult.total;
      var books = searchResult.books;

      $.each(books, function(index, book) {
          $(".hidden-panel ul").append("<li>"
          + "<div class='book-cover' style='background-image: url(" + book.imageUrl + ");'></div>"
          + "<div class='book-description'>"
          + "<h2>" + book.title +"</h2>"
          + "<p>" + book.description +"</p>"
          + "</div>"
          + "<button>Add</button>"
          + "<div style='clear: both'></div>"
          + "<div class='separate-line'></div>"
          +"</li>");
      });
  }

  var timerID;
  $(".input-field").keyup(function() {
    clearInterval(timerID);
    timerID = setTimeout(bookSearch, 500);
  });

  $(".input-field").keypress(function(e) {
    if(e.which == 13) {
      console.log("should work");
      bookSearch;
    }
  });

}); // end of ready