$(document).ready(function() {
  // 1. Bang effect
    $(".booksnumber-keeper, .unordered-line").hide();

    $('.unordered-books button').on('click', function() {
      if ($('.unordered-wrapper').hasClass('slided-up')) {
        slideUnorderedListDown();
      }
      else {
        slideUnorderedListUp();
      }
    });

    function slideUnorderedListUp() {
      $('.unordered-wrapper').addClass('slided-up');
      $('.unordered-wrapper').slideUp();
      showNumberOfBookInUnordered();
    }

    function slideUnorderedListDown() {
      removeHtmlUnderSlider();
      $('.unordered-wrapper').removeClass('slided-up');
      $('.unordered-wrapper').slideDown();
    }

    function showNumberOfBookInUnordered() {
      var unorderedLength = $('.unordered-books li').length;
      $('.unordered-books').animate({'height':'55px'}, 300, function() {
        $('.booksnumber-keeper span').html(unorderedLength);
        $('.booksnumber-keeper, .unordered-line').show(500);
      });
    }

    function removeHtmlUnderSlider() {
      $('.unordered-books').css({'height':''});
      $(".booksnumber-keeper, .unordered-line").hide();
    }

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