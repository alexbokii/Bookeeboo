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

  //2. Height of h5 in ordered list
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
  
}); // end of ready