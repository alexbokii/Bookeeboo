$(document).ready(function() {

  //1. Bang effect
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


  
  

}); // end of ready