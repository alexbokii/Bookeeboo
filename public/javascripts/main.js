$(document).ready(function() {

	//1. Ajax for unordered list
	$.ajax('/api/unordered', {
		success: function(response) {
			response.books.slice(0,6).forEach (function (book, index) {
				console.log(index);
				$(".unordered-books ul").append("<li><img src='" + book.imageUrl + "'></li>");
			});
			console.log(response);
		},
		error: function(request, errorType, errorMessage) {
			console.log("Error: " + errorType + " with message: " + errorMessage);
		}
	});

	//2. Ajax for current book
  var book = {autor: "Alex Bokii", title: "CSS today", pageCount: 322};
  var currentPage = 0;
  var sliderPositionPr;

  $(".last-page").html(book.pageCount);
  

  // 1. Create slider and function wthem we move it
  $( ".slider" ).slider({
     slide: function changeCurrentPageOnSlide( event, ui ) {
      sliderPositionPx = parseFloat($(".ui-slider-handle").css("left"));
      
      getPositionInPr(sliderPositionPx);
      changeCurrentPage();
      changeSliderStyle();
      displayCurrentPage();
     }
  });

  function getPositionInPr(pxAmount) {
    sliderPositionPr = pxAmount / 900 * 100;
  }

  function changeCurrentPage() {
    currentPage = book.pageCount / 100 * sliderPositionPr;
  }

  function changeSliderStyle() {
    $(".slider").css({
      'background':'linear-gradient(90deg, #F0B446 ' + sliderPositionPr + '%, #515960 ' + sliderPositionPr + '%)'
    });
    $(".page-display").css("padding-left", + ""+ sliderPositionPr + "%");
    }

    function displayCurrentPage() {
      var a = Math.ceil(currentPage);
      $(".page-display").html(a);
    }
     //2. Create function for changing pages count with buton
    $("li.amount").on("click", changePageCountOnButton);

    function changePageCountOnButton() {
      var operator = $(this).closest("ul");
      var changingAmount= $(this).text();
      changingAmount = parseFloat(changingAmount);

     if (operator.hasClass("minus")) {
        var result = currentPage - changingAmount;
        if (result <= 0) {
          return;
        }
        currentPage = result;
      }
      else if (operator.hasClass("plus")) {
        var result = currentPage + changingAmount;
        if (result > book.pageCount) {
          return;
        }
        currentPage = result;
      }

      sliderPositionPr = currentPage / book.pageCount * 100;

      changeSliderStyle();
      displayCurrentPage();
    }

}); // end of ready