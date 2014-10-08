$(document).ready(function() {
  // 1. Bang effect
    $(".page-keeper, .unordered-line").hide();

    $('.unordered-books button').on('click', function(e) {
      if($('.unordered-books').hasClass('slided-up')) {
        $('.unordered-books').removeClass('slided-up');
        $('.unordered-wrapper').slideDown();
        console.log(e.type + " down");
        $(".page-keeper, .unordered-line").hide();
      }
      else {
        $('.unordered-wrapper').slideUp();
        $('.unordered-books').addClass("slided-up");
        console.log(e.type + " up");
        setTimeout(function() {
          $(".page-keeper, .unordered-line").show();
        }, 300);
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