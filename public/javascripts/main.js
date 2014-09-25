$(document).ready(function() {

  //1. Bang effect
  $(".page-keeper, .unordered-line").hide();
  $(".unordered-books button").on('click', function() {
    var pageKeeperContent = $(".unordered-books li").length;
    $('.page-keeper').html(pageKeeperContent);
    var c = $("ul li").length;
    if ( $( ".unordered-wrapper" ).is( ":hidden" ) ) {
      $( ".unordered-wrapper" ).slideDown(700, "easeOutQuint");
      $(".page-keeper, .unordered-line").slideUp();
      $(".unordered-books").removeClass("hidden-height");
    } 
    else {
      $( ".unordered-wrapper" ).slideUp(900, "easeInOutQuint", function() {
        $(".unordered-books").addClass("hidden-height");
        $(".page-keeper, .unordered-line").slideDown();
      });
    }
  });


  
  

}); // end of ready